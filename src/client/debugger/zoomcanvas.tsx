import { FunctionComponent, h, ComponentType } from 'preact';
import { createPortal } from 'preact/compat';
import { Ref, useEffect, useRef, useState } from 'preact/hooks';
import '../styles.css';
import styles from './zoomcanvas.module.css';

export interface IZoomProps {
	x?: number;
	y?: number;
}

export const ZoomCanvas: FunctionComponent<{
	canvas: Ref<HTMLCanvasElement>;
	scale: number;
	width: number;
	height: number;
	infoWidth: number; // used for clipping
	infoHeight: number;
	ZoomInfo: ComponentType<IZoomProps>;
	zoomExtraProps?: any;
	onClick?: (x: number, y: number) => void;
}> = ({ canvas, scale, width, height, infoWidth, infoHeight, ZoomInfo, zoomExtraProps, onClick }) => {
	const zoomDiv = useRef<HTMLDivElement>();
	const zoomCanvas = useRef<HTMLCanvasElement>();

	const [zoomProps, setZoomProps] = useState<IZoomProps>({});

	// install mouse handlers
	useEffect(() => {
		if(!canvas.current)
			return;

		const canvasScaleX = parseInt(canvas.current.getAttribute('data-canvasScaleX'));
		const canvasScaleY = parseInt(canvas.current.getAttribute('data-canvasScaleY'));

		const onMouseMove = (evt: MouseEvent) => {
			const snapX = (p: number) => Math.floor(p / canvasScaleX) * canvasScaleX;
			const snapY = (p: number) => Math.floor(p / canvasScaleY) * canvasScaleY;
			const context = zoomCanvas.current?.getContext('2d');
			context.imageSmoothingEnabled = false;
			context.clearRect(0, 0, width, height);
			const srcWidth = width / scale;
			const srcHeight = height / scale;
			context.drawImage(canvas.current, snapX(evt.offsetX) - srcWidth / 2, snapY(evt.offsetY) - srcHeight / 2, srcWidth, srcHeight, 0, 0, width, height);
			context.lineWidth = 2;
			context.strokeStyle = 'rgba(0,0,0,1)';
			context.strokeRect((width - scale * canvasScaleX) / 2 + scale, (height - scale * canvasScaleY) / 2 + scale, scale * canvasScaleX, scale * canvasScaleY);
			context.strokeStyle = 'rgba(255,255,255,1)';
			context.strokeRect((width - scale * canvasScaleX) / 2 + scale - 2, (height - scale * canvasScaleY) / 2 + scale - 2, scale * canvasScaleX + 4, scale * canvasScaleY + 4);
			const x = Math.floor(evt.offsetX / canvasScaleX);
			const y = Math.floor(evt.offsetY / canvasScaleY);
			setZoomProps({ x, y });
			// position zoomCanvas
			const top = Math.min(document.body.clientHeight - infoHeight, evt.pageY + 10);
			const left = Math.min(document.body.clientWidth - infoWidth, evt.pageX + 10);
			zoomDiv.current.style.top = `${top}px`;
			zoomDiv.current.style.left = `${left}px`;
			zoomDiv.current.style.display = 'block';
		};
		canvas.current.onmousemove = onMouseMove;

		const onMouseLeave = (evt: MouseEvent) => {
			zoomDiv.current.style.display = 'none';
		};
		canvas.current.onmouseleave = onMouseLeave;

		if(onClick) {
			const onMouseDown = (evt: MouseEvent) => {
				const srcX = Math.floor(evt.offsetX / canvasScaleX);
				const srcY = Math.floor(evt.offsetY / canvasScaleY);
				onClick(srcX, srcY);
			};
			canvas.current.onmousedown = onMouseDown;
		}
	}, [canvas, setZoomProps, onClick]);

	return createPortal(<div ref={zoomDiv} class={styles.zoom} style={{ display: 'none' }}>
		<canvas ref={zoomCanvas} width={width} height={height} />
		<ZoomInfo x={zoomProps.x} y={zoomProps.y} {...zoomExtraProps} />
	</div>, document.body);
};
