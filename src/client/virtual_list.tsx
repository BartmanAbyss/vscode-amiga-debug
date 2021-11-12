// based on https://github.com/developit/preact-virtual-list/blob/master/src/index.js
// Copyright (c) 2016 Jason Miller. MIT License.

import { h, JSX, Component } from 'preact';

const STYLE_INNER = 'position:relative; overflow:hidden; width:100%; min-height:100%;';
const STYLE_CONTENT = 'position:absolute; top:0; left:0; height:100%; width:100%; overflow:visible;';

export interface Absolute {
	top: number;
	height: number;
}

interface VirtualListProps<R, A extends Absolute> {
	rows: R[];
	renderRow: (row: R, index?: number) => JSX.Element;
	rowHeight: number;
	absolutes?: A[];
	renderAbsolute?: (absolute: A) => JSX.Element;
	overscanCount?: number;
	sync?: boolean;
	[x: string]: any; // passthrough properties
}

export class VirtualList<R, A extends Absolute> extends Component<VirtualListProps<R, A>, { offset: number; height: number }> {
	private resize = () => {
		if (this.state.height !== (this.base as HTMLElement).offsetHeight) {
			this.setState({ height: (this.base as HTMLElement).offsetHeight });
		}
	};

	private handleScroll = () => {
		this.setState({ offset: (this.base as HTMLElement).scrollTop });
		if (this.props.sync) this.forceUpdate();
	};

	public componentDidUpdate() {
		this.resize();
	}

	public componentDidMount() {
		this.resize();
		addEventListener('resize', this.resize);
	}

	public componentWillUnmount() {
		removeEventListener('resize', this.resize);
	}

	public render({ rows, rowHeight, renderRow, absolutes, renderAbsolute, overscanCount=10, sync, ...props }: VirtualListProps<R, A>, { offset=0, height=0 }) {
		// first visible row index
		let start = (offset / rowHeight)|0;

		// actual number of visible rows (without overscan)
		let visibleRowCount = (height / rowHeight)|0;

		// Overscan: render blocks of rows modulo an overscan row count
		// This dramatically reduces DOM writes during scrolling
		if (overscanCount) {
			start = Math.max(0, start - (start % overscanCount));
			visibleRowCount += overscanCount;
		}

		// last visible + overscan row index
		const end = start + 1 + visibleRowCount;

		// data slice currently in viewport plus overscan items
		const selection = rows.slice(start, end);

		return (
			<div onScroll={this.handleScroll} {...props}>
				<div style={`${STYLE_INNER} height:${rows.length*rowHeight}px;`}>
					{absolutes && absolutes.filter((a) => a.top < end*rowHeight && a.top + a.height >= start*rowHeight).map((a) => renderAbsolute(a))}
					<div style={`${STYLE_CONTENT} top:${start*rowHeight}px;`}>
						{selection.map((value: R, index: number) => renderRow(value, start + index))}
					</div>
				</div>
			</div>
		);
	}
}
