// code based on react-dropdown Copyright (c) 2014 xvfeng, MIT license

import { h, Component } from 'preact';

export interface Option {
	label: React.ReactNode;
	value: string;
	className?: string;
}
export interface Group {
	type: "group";
	name: string;
	items: Option[];
}
export interface ReactDropdownProps {
	options: Array<Group | Option | string>;
	baseClassName?: string;
	className?: string;
	controlClassName?: string;
	placeholderClassName?: string;
	menuClassName?: string;
	arrowClassName?: string;
	disabled?: boolean;
	arrowClosed?: React.ReactNode;
	arrowOpen?: React.ReactNode;
	onChange?: (arg: Option) => void;
	onFocus?: (arg: boolean) => void;
	value?: Option | string;
	placeholder?: String;
}

const DEFAULT_PLACEHOLDER_STRING = 'Select...';

const hasOwn = {}.hasOwnProperty;

function classNames(...args: any[]) {
	const classes = [];

	for (let i = 0; i < args.length; i++) {
		const arg = args[i];
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

export class ReactDropdown extends Component<ReactDropdownProps, {
	selected: {
		label: string;
		value: string;
	},
	isOpen: boolean;
}> {
	public static defaultProps = { baseClassName: 'Dropdown' };

	private mounted: boolean;

	constructor(props: ReactDropdownProps) {
		super(props);
		this.state = {
			selected: this.parseValue(props.value, props.options) || {
				label: typeof props.placeholder === 'undefined' ? DEFAULT_PLACEHOLDER_STRING : props.placeholder,
				value: ''
			},
			isOpen: false
		};
		this.mounted = true;
		this.handleDocumentClick = this.handleDocumentClick.bind(this);
		this.fireChangeEvent = this.fireChangeEvent.bind(this);
	}
	public componentWillReceiveProps(newProps) {
		if (newProps.value) {
			const selected = this.parseValue(newProps.value, newProps.options);
			if (selected !== this.state.selected) {
				this.setState({ selected });
			}
		} else {
			this.setState({
				selected: {
					label: typeof newProps.placeholder === 'undefined' ? DEFAULT_PLACEHOLDER_STRING : newProps.placeholder,
					value: ''
				}
			});
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

	private handleMouseDown(event) {
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

	private parseValue(value, options) {
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

	public setValue(value, label) {
		const newState = {
			selected: {
				value,
				label
			},
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

	public renderOption(option) {
		let value = option.value;
		if (typeof value === 'undefined') {
			value = option.label || option;
		}
		const label = option.label || option.value || option;
		const isSelected = value === this.state.selected.value || value === this.state.selected;

		const classes = {
			[`${this.props.baseClassName}-option`]: true,
			[option.className]: !!option.className,
			'is-selected': isSelected
		};

		const optionClass = classNames(classes);

		return (
			<div
				key={value}
				className={optionClass}
				onMouseDown={this.setValue.bind(this, value, label)}
				onClick={this.setValue.bind(this, value, label)}
				role='option'
				aria-selected={isSelected ? 'true' : 'false'}>
				{label}
			</div>
		);
	}

	public buildMenu() {
		const { options, baseClassName } = this.props;
		const ops = options.map((option) => {
			if ((option as Group).type === 'group') {
				const groupTitle = (<div className={`${baseClassName}-title`}>
					{(option as Group).name}
				</div>);
				let _options = (option as Group).items.map((item) => this.renderOption(item));

				return (
					<div className={`${baseClassName}-group`} key={(option as Group).name} role='listbox' tabIndex={-1}>
						{groupTitle}
						{_options}
					</div>
				);
			} else {
				return this.renderOption(option);
			}
		});

		return ops.length ? ops : <div className={`${baseClassName}-noresults`}>
			No options found
		</div>;
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

	public isValueSelected() {
		return typeof this.state.selected === 'string' || this.state.selected.value !== '';
	}

	public render() {
		const { baseClassName, controlClassName, placeholderClassName, menuClassName, arrowClassName, arrowClosed, arrowOpen, className } = this.props;

		const disabledClass = this.props.disabled ? 'Dropdown-disabled' : '';
		const placeHolderValue = typeof this.state.selected === 'string' ? this.state.selected : this.state.selected.label;

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
			'is-selected': this.isValueSelected()
		});
		const menuClass = classNames({
			[`${baseClassName}-menu`]: true,
			[menuClassName]: !!menuClassName
		});
		const arrowClass = classNames({
			[`${baseClassName}-arrow`]: true,
			[arrowClassName]: !!arrowClassName
		});

		const value = (<div className={placeholderClass}>
			{placeHolderValue}
		</div>);
		const menu = this.state.isOpen ? <div className={menuClass} aria-expanded='true'>
			{this.buildMenu()}
		</div> : null;

		return (
			<div className={dropdownClass}>
				<div className={controlClass} onMouseDown={this.handleMouseDown.bind(this)} onTouchEnd={this.handleMouseDown.bind(this)} aria-haspopup='listbox'>
					{value}
					<div className={`${baseClassName}-arrow-wrapper`}>
						{arrowOpen && arrowClosed
							? this.state.isOpen ? arrowOpen : arrowClosed
							: <span className={arrowClass} />}
					</div>
				</div>
				{menu}
			</div>
		);
	}
}
