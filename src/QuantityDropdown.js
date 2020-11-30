import React, {Component} from "react";
import PropTypes from "prop-types";

import './QuantityDropdown.css';

class QuantityOptionItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: props.count,
        };

        this.decrement = this.decrement.bind(this);
        this.increment = this.increment.bind(this);
    }

    decrement() {
        this.setState((state, props) => {
            let nextVal = state.count - 1;
            nextVal = Math.max(props.minValue, nextVal);
            return this.updateCount(state, nextVal);
        });
    }

    increment() {
        this.setState((state, props) => {
            let nextVal = state.count + 1;
            nextVal = Math.min(props.maxValue, nextVal);
            return this.updateCount(state, nextVal);
        });
    }

    updateCount(state, nextVal) {
        if (nextVal === state.count) return {};
        this.props.onChange(nextVal);
        return {count: nextVal};
    }

    render() {
        return (
            <div className="iqdropdown-menu-option">
                <div className="iqdropdown-content">
                    <p className="iqdropdown-item">{this.props.title}</p>
                    <p className="iqdropdown-description">{this.props.description}</p>
                </div>
                <div className="iqdropdown-item-controls">
                    <button className="button-decrement" onClick={this.decrement}>
                        <i className="icon-decrement"></i>
                    </button>
                    <span className="counter">{this.state.count}</span>
                    <button className="button-increment" onClick={this.increment}>
                        <i className="icon-decrement icon-increment"></i>
                    </button>
                </div>
            </div>
        );
    }
}

QuantityOptionItem.propTypes = {
    count: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    minValue: PropTypes.number,
    maxValue: PropTypes.number,
};

QuantityOptionItem.defaultProps = {
    count: 0,
    title: '',
    description: '',
    maxValue: Infinity,
    minValue: 0,
    onChange: (value) => {
    },
};

class QuantityDropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options: this.createOptions(),
            isOpen: false,
        };
        this.menuRef = React.createRef();
        this.onChangeOption = this.onChangeOption.bind(this);
        this.toggleOpen = this.toggleOpen.bind(this);
    }

    onChangeOption(key, val) {
        this.setState((state, props) => {
            const targetOpt = state.options.find(opt => opt.key === key);
            if (!targetOpt) return;
            targetOpt.count = val;
            this.props.onChange(key, val, this.accumResult());
            return {options: state.options};
        });
    }

    accumResult() {
        const out = {};
        this.state.options
            .forEach(o => out[o.key] = o.count);
        return out;
    }

    toggleOpen(event) {
        if (this.menuRef.current.contains(event.target)) return;
        this.setState((state, props) => ({isOpen: !state.isOpen}));
    }

    render() {
        const options = this.state.options
            .map((opt) => {
                return (
                    <QuantityOptionItem
                        key={opt.key}
                        count={opt.count}
                        title={opt.title}
                        description={opt.description}
                        minValue={this.props.minValue}
                        maxValue={this.props.maxValue}
                        onChange={(val) => this.onChangeOption(opt.key, val)}
                    />
                );
            });
        const total = this.state.options
            .reduce((accum, opt) => accum + opt.count, 0);
        let selectionText = this.props.calcSelectionText(total, this.accumResult());
        if (selectionText === null) {
            selectionText = `${total} `;
            selectionText += (total === 1)
                ? this.props.selectionText
                : this.props.textPlural;
        }
        const containerClassList = ['iqdropdown'];
        if (this.state.isOpen) containerClassList.push('menu-open');
        return (
            <div
                className={containerClassList.join(' ')}
                onClick={event => this.toggleOpen(event)}
            >
                <p className="iqdropdown-selection">{selectionText}</p>
                <div className="iqdropdown-menu" ref={this.menuRef}>
                    {options}
                </div>
            </div>
        );
    }

    createOptions() {
        return this.props.options
            .map((option, idx) => {
                return Object.assign({
                    title: '',
                    descriptions: '',
                    count: this.props.minValue,
                    key: idx.toString()
                }, option);
            })
    }
}

QuantityDropdown.propTypes = {
    maxValue: PropTypes.number,
    minValue: PropTypes.number,
    selectionText: PropTypes.string,
    textPlural: PropTypes.string,
};

QuantityDropdown.defaultProps = {
    // max total items
    maxValue: Infinity,
    // min total items
    minValue: 0,
    // text to show on the dropdown override data-selection-text attribute
    selectionText: 'item',
    // text to show for multiple items
    textPlural: 'items',
    // optionally can use setSelectionText function to override selectionText
    calcSelectionText: (totalCount, totalItems) => null,
    // fires when an item quantity changes
    onChange: (key, count, totalItems) => {
    },
    options: [],
};

export default QuantityDropdown;
