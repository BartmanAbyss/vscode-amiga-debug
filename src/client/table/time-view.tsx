/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { h, FunctionComponent, Fragment, createContext } from 'preact';
import styles from './time-view.module.css';
import {
	useMemo,
	useCallback,
	useContext,
	useState,
	useLayoutEffect,
	useRef,
	useEffect,
} from 'preact/hooks';
import { VsCodeApi } from '../vscodeApi';
import { IGraphNode } from '../model';
import { classes } from '../util';
import { IOpenDocumentMessage } from '../types';
import { addToSet, removeFromSet, toggleInSet } from '../array';
import * as ChevronDown from '../icons/chevron-down.svg';
import * as ChevronRight from '../icons/chevron-right.svg';
import { Icon } from '../icons';
import VirtualList from 'preact-virtual-list';
import { getLocationText, formatValue, DisplayUnit, dataName } from '../display';
import { IRichFilter, compileFilter } from '../filter';

//type SortFn = (node: ILocation) => number;

enum SortFn {
	Self,
	Agg
}

//const selfTime: SortFn = (n) => n.selfTime;
//const aggTime: SortFn = (n) => n.aggregateTime;

interface NodeAtDepth { node: IGraphNode; depth: number; position: number; }

const getGlobalUniqueId = (node: IGraphNode) => {
	const parts = [node.id];
	for (let n = node.parent; n; n = n.parent) {
		parts.push(n.id);
	}

	return parts.join('-');
};

// store state because component will get unmounted when tab switches
interface IState {
	sortFn: SortFn;
	focused: undefined | IGraphNode;
	expanded: ReadonlySet<IGraphNode>;
	filterExpanded: ReadonlySet<IGraphNode>;
}
const Context = createContext<IState>({ sortFn: SortFn.Agg, focused: undefined, expanded: new Set(), filterExpanded: new Set() });

export const TimeView: FunctionComponent<{
	data: ReadonlyArray<IGraphNode>;
	filter: IRichFilter;
	displayUnit: DisplayUnit;
}> = ({ data, filter, displayUnit }) => {
	const listRef = useRef<{ base: HTMLElement }>();
	const state = useContext<IState>(Context);
	const [sortFn, setSort2] = useState<SortFn>(state.sortFn);
	const [focused, setFocused2] = useState<undefined | IGraphNode>(state.focused);
	const [expanded, setExpanded2] = useState<ReadonlySet<IGraphNode>>(state.expanded); // nodes expanded by user
	const [filterExpanded, setFilterExpanded2] = useState<ReadonlySet<IGraphNode>>(state.filterExpanded); // nodes expanded by search filter
	const setSort = useMemo(() => (newSort: SortFn) => {
		state.sortFn = newSort;
		setSort2(newSort);
	}, [setSort2]);
	const setFocused = useMemo(() => (newFocused: undefined | IGraphNode) => {
		state.focused = newFocused;
		setFocused2(newFocused);
	}, [setFocused2]);
	const setExpanded = useMemo(() => (newExpanded: ReadonlySet<IGraphNode>) => {
		state.expanded = new Set(newExpanded);
		setExpanded2(newExpanded);
	}, [setExpanded2]);
	const setFilterExpanded = useMemo(() => (newExpanded: ReadonlySet<IGraphNode>) => {
		state.filterExpanded = new Set(newExpanded);
		setFilterExpanded2(newExpanded);
	}, [setFilterExpanded2]);

	const sort = (nodes: IGraphNode[]) => {
		switch(sortFn) {
			case SortFn.Agg: nodes.sort((a, b) => b.aggregateTime - a.aggregateTime); break;
			case SortFn.Agg: nodes.sort((a, b) => b.selfTime - a.selfTime); break;
		}
		return nodes;
	};

	const getSortedChildren = (node: IGraphNode) => {
		const children = Object.values(node.children);
		sort(children);
		return children;
	};

	// filter
	useMemo(() => {
		const filterFn = compileFilter(filter);
		const getFilterText = (node: IGraphNode) => [
			node.callFrame.functionName,
			node.callFrame.url,
			node.src?.source.path ?? '',
		];

		const newExpanded = new Set([...expanded]);

		const filterNode = (node: IGraphNode) => {
			node.filtered = getFilterText(node).some(filterFn);
			if(node.filtered) {
				for(let p = node.parent; p; p = p.parent) {
					if(!p.filtered)
						newExpanded.add(p);
				}
			}
			for(const c of Object.values(node.children)) {
				filterNode(c);
			}
		};

		for(const c of data) {
			filterNode(c);
		}

		setFilterExpanded(newExpanded);
	}, [data, filter, expanded]);

	// 1. Top level sorted items
	const sorted = useMemo(() => sort(data.slice()), [data, filter, sortFn]);

	// 2. Expand nested child nodes
	const rendered = useMemo(() => {
		const output: NodeAtDepth[] = sorted.map((node) => ({ node, position: 1, depth: 0 }));
		for (let i = 0; i < output.length; i++) {
			const { node, depth } = output[i];
			if (expanded.has(node) || filterExpanded.has(node)) {
				const toAdd = getSortedChildren(node).map((node, i) => ({
					node,
					position: i + 1,
					depth: depth + 1,
				}));
				output.splice(i + 1, 0, ...toAdd);
				// we don't increment i further since we want to recurse and expand these nodes
			}
		}

		return output;
	}, [sorted, expanded, filterExpanded, sortFn]);

	const onKeyDown = useCallback(
		(evt: KeyboardEvent, node: IGraphNode) => {
			let nextFocus: IGraphNode | undefined;
			switch (evt.key) {
				case 'Enter':
				case 'Space':
					setExpanded(toggleInSet(expanded, node));
					evt.preventDefault();
					break;
				case 'ArrowDown':
					nextFocus = rendered[rendered.findIndex((n) => n.node === node) + 1]?.node;
					break;
				case 'ArrowUp':
					nextFocus = rendered[rendered.findIndex((n) => n.node === node) - 1]?.node;
					break;
				case 'ArrowLeft':
					if (expanded.has(node)) {
						setExpanded(removeFromSet(expanded, node));
					} else {
						nextFocus = node.parent;
					}
					break;
				case 'ArrowRight':
					if (node.childrenSize > 0 && !expanded.has(node)) {
						setExpanded(addToSet(expanded, node));
					} else {
						nextFocus = rendered.find((n) => n.node.parent === node)?.node;
					}
					break;
				case 'Home':
					if (listRef.current) {
						listRef.current.base.scrollTop = 0;
					}

					nextFocus = rendered[0]?.node;
					break;
				case 'End':
					if (listRef.current) {
						listRef.current.base.scrollTop = listRef.current.base.scrollHeight;
					}

					nextFocus = rendered[rendered.length - 1]?.node;
					break;
				case '*':
					const nextExpanded = new Set(expanded);
					for (const child of Object.values(focused?.parent?.children || {})) {
						nextExpanded.add(child);
					}
					setExpanded(nextExpanded);
					break;
			}

			if (nextFocus) {
				setFocused(nextFocus);
				evt.preventDefault();
			}
		},
		[rendered, expanded, getSortedChildren],
	);

	useEffect(() => listRef.current?.base.setAttribute('role', 'tree'), [listRef.current]);

	useLayoutEffect(() => {
		const el = listRef.current?.base;
		if (!el || !focused) {
			return;
		}

		setTimeout(() => {
			const button: HTMLButtonElement | null = el.querySelector(
				`[data-row-id="${getGlobalUniqueId(focused)}"]`,
			);
			button?.focus();
		});
	}, [focused]);

	const renderRow = useCallback(
		(row: NodeAtDepth) => (
			<TimeViewRow
				onKeyDown={onKeyDown}
				node={row.node}
				depth={row.depth}
				position={row.position}
				expanded={expanded}
				onExpandChange={setExpanded}
				onFocus={setFocused}
				displayUnit={displayUnit}
			/>
		),
		[expanded, setExpanded, onKeyDown, displayUnit],
	);

	return (
		<Fragment>
			<TimeViewHeader sortFn={sortFn} onChangeSort={setSort} displayUnit={displayUnit} shrinkler={data[0].origAggregateTime > 0} />
			<VirtualList
				ref={listRef}
				className={styles.rows}
				data={rendered.filter((n) => n.node.filtered || expanded.has(n.node) || filterExpanded.has(n.node))}
				renderRow={renderRow}
				rowHeight={20}
				overscanCount={10}
			/>
		</Fragment>
	);
};

const TimeViewHeader: FunctionComponent<{
	sortFn: SortFn;
	onChangeSort: (newFn: SortFn) => void;
	displayUnit: DisplayUnit;
	shrinkler: boolean;
}> = ({ sortFn, onChangeSort, displayUnit, shrinkler }) => {
	return (
		<div className={styles.row}>
			{!shrinkler && <div
				id="self-time-header"
				className={classes(styles.heading, styles.timing)}
				aria-sort={sortFn === SortFn.Self ? 'descending' : undefined}
				onClick={useCallback(() => onChangeSort(sortFn === SortFn.Self ? SortFn.Agg : SortFn.Self), [sortFn])}
			>
				{sortFn === SortFn.Self && <Icon i={ChevronDown} />}
				Self {dataName(displayUnit)}
			</div>}
			{shrinkler && <div className={classes(styles.heading, styles.timing)}>
				Original {dataName(displayUnit)}
			</div>}
			<div
				id="total-time-header"
				className={classes(styles.heading, styles.timing)}
				aria-sort={sortFn === SortFn.Agg ? 'descending' : undefined}
				onClick={useCallback(() => onChangeSort(sortFn === SortFn.Agg ? SortFn.Self : SortFn.Agg), [sortFn])}
			>
				{sortFn === SortFn.Agg && <Icon i={ChevronDown} />}
				{shrinkler ? '' : 'Total '}{dataName(displayUnit)}
			</div>
			{shrinkler && <div className={classes(styles.heading, styles.timing_short)}>
				Ratio
			</div>}
			<div className={classes(styles.heading, styles.location)}>
				{shrinkler ? 'Hunk/Symbol' : 'File'}
			</div>
		</div>
	);
};

const TimeViewRow: FunctionComponent<{
	node: IGraphNode;
	depth: number;
	position: number;
	expanded: ReadonlySet<IGraphNode>;
	onExpandChange: (expanded: ReadonlySet<IGraphNode>) => void;
	onKeyDown?: (evt: KeyboardEvent, node: IGraphNode) => void;
	onFocus?: (node: IGraphNode) => void;
	displayUnit: DisplayUnit;
}> = ({
	node,
	depth,
	position,
	expanded,
	onKeyDown: onKeyDownRaw,
	onFocus: onFocusRaw,
	onExpandChange,
	displayUnit,
}) => {
	const onClick = useCallback(
		(evt: MouseEvent) =>
			VsCodeApi.postMessage<IOpenDocumentMessage>({
				type: 'openDocument',
				callFrame: node.callFrame,
				location: node.src,
				toSide: evt.altKey,
			}),
		[node],
	);

	const onToggleExpand = useCallback((event: MouseEvent) => {
		if(event.shiftKey) {
			const nextExpanded = new Set(expanded);
			if(expanded.has(node)) {
				// collapse
				const collapseChildren = (n: IGraphNode) => {
					for (const child of Object.values(n.children)) {
						nextExpanded.delete(child);
						collapseChildren(child);
					}
				};
				nextExpanded.delete(node);
				collapseChildren(node);
			} else {
				// expand
				const expandChildren = (n: IGraphNode) => {
					for (const child of Object.values(n.children)) {
						nextExpanded.add(child);
						expandChildren(child);
					}
				};
				nextExpanded.add(node);
				expandChildren(node);
			}
			onExpandChange(nextExpanded);
		} else {
			onExpandChange(toggleInSet(expanded, node));
		}
	}, [expanded, onExpandChange, node]);

	const onMouseDown = (event: MouseEvent) => {
		if(event.shiftKey)
			event.preventDefault();
	};

	const onKeyDown = useCallback(
		(evt: KeyboardEvent) => {
			onKeyDownRaw?.(evt, node);
		},
		[onKeyDownRaw, node],
	);

	const onFocus = useCallback(() => {
		onFocusRaw?.(node);
	}, [onFocusRaw, node]);

	let root = node;
	while (root.parent) {
		root = root.parent;
	}

	const location = getLocationText(node);
	const expand = (
		<span className={styles.expander} onClick={onToggleExpand} onMouseDown={onMouseDown}>
			{node.childrenSize > 0 ? <Icon i={expanded.has(node) ? ChevronDown : ChevronRight} /> : null}
		</span>
	);

	let style = {};
	if(!node.filtered)
		style = {
			opacity: 0.5
		};

	return (
		<div
			className={styles.row}
			style={style}
			data-row-id={getGlobalUniqueId(node)}
			onKeyDown={onKeyDown}
			onFocus={onFocus}
			tabIndex={0}
			role="treeitem"
			aria-posinset={position}
			aria-setsize={node.parent?.childrenSize ?? 1}
			aria-level={depth + 1}
			aria-expanded={expanded.has(node)}
		>
			{!root.origAggregateTime ? <div className={styles.duration} aria-labelledby="self-time-header">
				<ImpactBar impact={node.selfTime / root.aggregateTime} />
				{formatValue(node.selfTime, root.aggregateTime, displayUnit)}
			</div> : ''}
			{root.origAggregateTime ? <div className={styles.duration}>
				<ImpactBar impact={node.origAggregateTime / root.origAggregateTime} />
				{formatValue(node.origAggregateTime, root.origAggregateTime, displayUnit)}
			</div> : ''}
			<div className={styles.duration} aria-labelledby="total-time-header">
				<ImpactBar impact={node.aggregateTime / root.aggregateTime} />
				{formatValue(node.aggregateTime, root.aggregateTime, displayUnit)}
			</div>
			{root.origAggregateTime ? <div className={classes(styles.duration, styles.short)}>
				{formatValue(node.aggregateTime, node.origAggregateTime, DisplayUnit.Percent)}
			</div> : ''}

			{!location ? (
				<div className={styles.location} style={{ marginLeft: depth * 15 }}>
					{expand} <span className={styles.fn} dangerouslySetInnerHTML={{__html: node.callFrame.functionName}}></span>
				</div>
			) : (
				<div className={styles.location} style={{ marginLeft: depth * 15 }}>
					{expand} <span className={styles.fn}>{node.callFrame.functionName}</span>
					<span className={styles.file}>
						<a href="#" onClick={onClick}>
							{location}
						</a>
					</span>
				</div>
			)}
		</div>
	);
};

const ImpactBar: FunctionComponent<{ impact: number }> = ({ impact }) => (
	<div className={styles.impactBar} style={{ transform: `scaleX(${impact})` }} />
);
