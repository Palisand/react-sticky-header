// @flow

import React, { Component } from 'react';
import cx from 'classnames';

import { addEvent } from './utils';

type Props = {
  children?: any,
  header: any,
  backgroundSrc?: string,
  backgroundColor?: string,
  headerOnly?: boolean,
  onSticky?: (isSticky: boolean) => void,
  className?: string,
};

type State = {
  isSticky: boolean,
};

export default class ReactStickyHeader extends Component {
  // eslint-disable-next-line react/sort-comp
  props: Props;
  detatch: () => void;
  initialised: boolean;
  _fixed: HTMLElement;
  _root: HTMLElement;

  state: State = {
    isSticky: false,
  };

  componentDidMount () {
    this.initialise();
  }

  componentDidUpdate (prevProps: Props) {
    if (prevProps.headerOnly === this.props.headerOnly) {
      return;
    }

    this.initialise();
  }

  componentWillUnmount () {
    this.detatch();
  }

  onScroll = () => {
    const { onSticky } = this.props;
    const { isSticky } = this.state;

    requestAnimationFrame(() => {
      const stickyHeaderHeight = this._fixed.offsetHeight;
      const headerHeight = this._root.offsetHeight;
      const headerBounds = this._root.getBoundingClientRect();

      const sticky = ((headerHeight + headerBounds.top) - stickyHeaderHeight) <= 0;

      if (sticky && !isSticky) {
        this.setState({
          isSticky: true,
        });

        onSticky && onSticky(true);

        return;
      }

      if (!sticky && isSticky) {
        this.setState({
          isSticky: false,
        });

        onSticky && onSticky(false);
      }
    });
  };

  initialise () {
    if (!this.initialised) {
      this.detatch = addEvent('scroll', this.onScroll);
    }

    this.onScroll();
    this.initialised = true;
  }

  render () {
    const { isSticky } = this.state;
    const { children, header, backgroundSrc, backgroundColor, headerOnly, className } = this.props;

    const backgroundImage = backgroundSrc && `url(${backgroundSrc})`;
    const rootOffsetHeight = this._root && this._root.offsetHeight;
    const fixedOffsetHeight = this._fixed && this._fixed.offsetHeight;

    return (
      <header className={cx('ReactStickyHeader_root', className)} ref={(e) => (this._root = e)}>
        <div className="ReactStickyHeader_fixed" ref={(e) => (this._fixed = e)}>
          {header}
        </div>

        <div
          className="ReactStickyHeader_midground"
          style={{
            height: rootOffsetHeight || fixedOffsetHeight,
            top: fixedOffsetHeight,
            backgroundImage,
            backgroundColor,
          }}
        />

        {headerOnly && <div style={{ height: fixedOffsetHeight }} />}

        {headerOnly || <div
          className="ReactStickyHeader_background-bg"
          style={{ backgroundImage, backgroundColor }}
        />}

        {headerOnly || <div
          className="ReactStickyHeader_foreground"
          style={{ opacity: isSticky ? 0 : 1, backgroundImage, backgroundColor }}
        />}

        {headerOnly || children}
      </header>
    );
  }
}
