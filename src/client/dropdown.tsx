// code based on react-dropdown, Copyright (c) 2014 xvfeng, MIT license

import { h, Component, ComponentType, createRef, JSX } from 'preact';

export interface Group<ValueType> {
	type: "group";
	name: string;
	items: ValueType[];
}

export interface DropdownOptionProps<ValueType> {
	option: ValueType;
	placeholder: boolean;
}

export interface DropdownProps<ValueType> {
	options: Array<Group<ValueType> | ValueType>;
	baseClassName?: string;
	className?: string;
	controlClassName?: string;
	placeholderClassName?: string;
	menuClassName?: string;
	arrowClassName?: string;
	disabled?: boolean;
	optionComponent: ComponentType<DropdownOptionProps<ValueType>>;
	onChange?: (arg: ValueType) => void;
	onFocus?: (arg: boolean) => void;
	value: ValueType;
}

// from classnames, Copyright (c) 2017 Jed Watson. MIT license
function classNames(...args: any[]) {
	const hasOwn = {}.hasOwnProperty;
	const classes = [];

	for(const arg of args) {
		if (!arg) continue;
		const argType = typeof arg;
		if (argType === 'string' || argType === 'number') {
			classes.push(arg);
		} else if (Array.isArray(arg)) {
			classes.push(classNames.apply(null, arg));
		} else if (argType === 'object') {
			for (const key in arg) {
				if (hasOwn.call(arg, key) && arg[key]) {
					classes.push(key);
				}
			}
		}
	}
	return classes.join(' ');
} 

export class DropdownComponent<ValueType> extends Component<DropdownProps<ValueType>, {
	selected: ValueType;
	isOpen: boolean;
}> {
	public static defaultProps = { baseClassName: 'Dropdown' };

	private mounted: boolean;
	public menuRef = createRef<HTMLDivElement>();

	constructor(props: DropdownProps<ValueType>) {
		super(props);
		this.state = {
			selected: this.parseValue(props.value, props.options),
			isOpen: false
		};
		this.mounted = true;
		this.handleDocumentClick = this.handleDocumentClick.bind(this);
		this.fireChangeEvent = this.fireChangeEvent.bind(this);
	}
	public componentWillReceiveProps(newProps: DropdownProps<ValueType>) {
		const selected = this.parseValue(newProps.value, newProps.options);
		if (selected !== this.state.selected) {
			this.setState({ selected });
		}
	}

	public componentDidMount() {
		document.addEventListener('click', this.handleDocumentClick, false);
		document.addEventListener('touchend', this.handleDocumentClick, false);
	}

	public componentWillUnmount() {
		this.mounted = false;
		document.removeEventListener('click', this.handleDocumentClick, false);
		document.removeEventListener('touchend', this.handleDocumentClick, false);
	}

	private handleMouseDown(event: JSX.TargetedMouseEvent<HTMLElement>) {
		if (this.props.onFocus && typeof this.props.onFocus === 'function') {
			this.props.onFocus(this.state.isOpen);
		}
		if (event.type === 'mousedown' && event.button !== 0) return;
		event.stopPropagation();
		event.preventDefault();

		if (!this.props.disabled) {
			this.setState({
				isOpen: !this.state.isOpen
			});
		}
	}

	private parseValue(value: ValueType | string, options) {
		let option;

		if (typeof value === 'string') {
			for (let i = 0, num = options.length; i < num; i++) {
				if (options[i].type === 'group') {
					const match = options[i].items.filter((item) => item.value === value);
					if (match.length) {
						option = match[0];
					}
				} else if (typeof options[i].value !== 'undefined' && options[i].value === value) {
					option = options[i];
				}
			}
		}

		return option || value;
	}

	public setValue(value: ValueType) {
		const newState = {
			selected: value,
			isOpen: false
		};
		this.fireChangeEvent(newState);
		this.setState(newState);
	}

	public fireChangeEvent(newState) {
		if (newState.selected !== this.state.selected && this.props.onChange) {
			this.props.onChange(newState.selected);
		}
	}

	public renderOption(option: ValueType) {
		const isSelected = option === this.state.selected;

		const classes = {
			[`${this.props.baseClassName}-option`]: true,
			'is-selected': isSelected
		};

		const optionClass = classNames(classes);

		const OptionComponent = this.props.optionComponent;

		return (
			<div class={optionClass} onMouseDown={this.setValue.bind(this, option)} onClick={this.setValue.bind(this, option)} role='option' aria-selected={isSelected ? 'true' : 'false'}>
				<OptionComponent option={option} placeholder={false} />
			</div>
		);
	}

	public buildMenu() {
		const { options, baseClassName } = this.props;
		const ops = options.map((option) => {
			if ((option as Group<ValueType>).type === 'group') {
				const groupTitle = (<div class={`${baseClassName}-title`}>
					{(option as Group<ValueType>).name}
				</div>);
				const groupOptions = (option as Group<ValueType>).items.map((item) => this.renderOption(item));

				return (
					<div class={`${baseClassName}-group`} key={(option as Group<ValueType>).name} role='listbox' tabIndex={-1}>
						{groupTitle}
						{groupOptions}
					</div>
				);
			} else {
				return this.renderOption(option as ValueType);
			}
		});
		return ops;
	}

	public handleDocumentClick(event) {
		if (this.mounted) {
			if (!this.base.contains(event.target)) {
				if (this.state.isOpen) {
					this.setState({ isOpen: false });
				}
			}
		}
	}

	public render() {
		const { baseClassName, controlClassName, placeholderClassName, menuClassName, arrowClassName, className } = this.props;

		const disabledClass = this.props.disabled ? 'Dropdown-disabled' : '';

		const dropdownClass = classNames({
			[`${baseClassName}-root`]: true,
			[className]: !!className,
			'is-open': this.state.isOpen
		});
		const controlClass = classNames({
			[`${baseClassName}-control`]: true,
			[controlClassName]: !!controlClassName,
			[disabledClass]: !!disabledClass
		});
		const placeholderClass = classNames({
			[`${baseClassName}-placeholder`]: true,
			[placeholderClassName]: !!placeholderClassName,
		});
		const menuClass = classNames({
			[`${baseClassName}-menu`]: true,
			[menuClassName]: !!menuClassName
		});
		const arrowClass = classNames({
			[`${baseClassName}-arrow`]: true,
			[arrowClassName]: !!arrowClassName
		});

		const OptionComponent = this.props.optionComponent;
		return (
			<div class={dropdownClass}>
				<div class={controlClass} onMouseDown={this.handleMouseDown.bind(this)} onTouchEnd={this.handleMouseDown.bind(this)} aria-haspopup='listbox'>
					<div class={placeholderClass}>
						<OptionComponent option={this.state.selected} placeholder={true} />
					</div>
					<div class={`${baseClassName}-arrow-wrapper`}>
						<span class={arrowClass} />
					</div>
				</div>
				<div ref={this.menuRef} class={menuClass} style={{ display: this.state.isOpen ? 'block' : 'none' }} aria-expanded='true'>
					{this.buildMenu()}
				</div>
			</div>
		);
	}
}
