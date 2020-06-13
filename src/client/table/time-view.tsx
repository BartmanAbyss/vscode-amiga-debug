/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { h, FunctionComponent, Fragment } from 'preact';
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
import { ILocation, IGraphNode } from '../model';
import { classes } from '../util';
import { IOpenDocumentMessage } from '../types';
import { addToSet, removeFromSet, toggleInSet } from '../array';
import * as ChevronDown from '../icons/chevron-down.svg';
import * as ChevronRight from '../icons/chevron-right.svg';
import { Icon } from '../icons';
//import VirtualList from 'preact-virtual-list';
import { getLocationText, formatValue, DisplayUnit, dataName } from '../display';
import { IRichFilter, compileFilter } from '../filter';

type SortFn = (node: ILocation) => number;

const selfTime: SortFn = (n) => n.selfTime;
const aggTime: SortFn = (n) => n.aggregateTime;

type NodeAtDepth = { node: IGraphNode; depth: number; position: number };

const getGlobalUniqueId = (node: IGraphNode) => {
	const parts = [node.id];
	for (let n = node.parent; n; n = n.parent) {
		parts.push(n.id);
	}

	return parts.join('-');
};

export const TimeView: FunctionComponent<{
	data: ReadonlyArray<IGraphNode>;
	filter: IRichFilter;
	displayUnit: DisplayUnit;
}> = ({ data, filter, displayUnit }) => {
	const listRef = useRef<{ base: HTMLElement }>();
	const [sortFn, setSort] = useState<SortFn | undefined>(() => aggTime);
	const [focused, setFocused] = useState<undefined | IGraphNode>(undefined);
	const [expanded, setExpanded] = useState<ReadonlySet<IGraphNode>>(new Set<IGraphNode>());
	const [filterExpanded, setFilterExpanded] = useState<ReadonlySet<IGraphNode>>(new Set<IGraphNode>());

	const getSortedChildren = (node: IGraphNode) => {
		const children = Object.values(node.children);
		if (sortFn) {
			children.sort((a, b) => sortFn(b) - sortFn(a));
		}

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
	}, [data, filter]);

	// 1. Top level sorted items
	const sorted = useMemo(
		() => (sortFn ? data.slice().sort((a, b) => sortFn(b) - sortFn(a)) : data),
		[data, filter, sortFn],
	);

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

	// had some strange jerking during scrolling
/*	const renderRow = useCallback(
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

	<VirtualList
		ref={listRef}
		className={styles.rows}
		data={rendered}
		renderRow={renderRow}
		rowHeight={25}
		overscanCount={10}
	/>
*/

	return (
		<Fragment>
			<TimeViewHeader sortFn={sortFn} onChangeSort={setSort} displayUnit={displayUnit} />
			<div className={styles.rows}>
				{rendered.filter((n) => n.node.filtered || expanded.has(n.node) || filterExpanded.has(n.node)).map((row) => (
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
				))}
			</div>
		</Fragment>
	);
};

const TimeViewHeader: FunctionComponent<{
	sortFn: SortFn | undefined;
	onChangeSort: (newFn: () => SortFn | undefined) => void;
	displayUnit: DisplayUnit
}> = ({ sortFn, onChangeSort, displayUnit }) => (
	<div className={styles.row}>
		<div
			id="self-time-header"
			className={classes(styles.heading, styles.timing)}
			aria-sort={sortFn === selfTime ? 'descending' : undefined}
			onClick={useCallback(() => onChangeSort(() => (sortFn === selfTime ? undefined : selfTime)), [sortFn])}
		>
			{sortFn === selfTime && <Icon i={ChevronDown} />}
			Self {dataName(displayUnit)}
		</div>
		<div
			id="total-time-header"
			className={classes(styles.heading, styles.timing)}
			aria-sort={sortFn === aggTime ? 'descending' : undefined}
			onClick={useCallback(() => onChangeSort(() => (sortFn === aggTime ? undefined : aggTime)), [sortFn])}
		>
			{sortFn === aggTime && <Icon i={ChevronDown} />}
			Total {dataName(displayUnit)}
		</div>
		<div className={styles.heading}>File</div>
	</div>
);

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
	const vscode = useContext(VsCodeApi);
	const onClick = useCallback(
		(evt: MouseEvent) =>
			vscode.postMessage<IOpenDocumentMessage>({
				type: 'openDocument',
				callFrame: node.callFrame,
				location: node.src,
				toSide: evt.altKey,
			}),
		[vscode, node],
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
			<div className={styles.duration} aria-labelledby="self-time-header">
				<ImpactBar impact={node.selfTime / root.aggregateTime} />
				{formatValue(node.selfTime, root.aggregateTime, displayUnit)}
			</div>
			<div className={styles.duration} aria-labelledby="total-time-header">
				<ImpactBar impact={node.aggregateTime / root.aggregateTime} />
				{formatValue(node.aggregateTime, root.aggregateTime, displayUnit)}
			</div>
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
