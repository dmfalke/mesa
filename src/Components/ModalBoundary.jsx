import React from 'react';
import PropTypes from 'prop-types';

import { uid, makeClassifier } from '../Utils/Utils';

const modalBoundaryClass = makeClassifier('ModalBoundary');

class ModalBoundary extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      modals: []
    };

    this.addModal = this.addModal.bind(this);
    this.removeModal = this.removeModal.bind(this);
    this.getChildContext = this.getChildContext.bind(this);
    this.renderModalWrapper = this.renderModalWrapper.bind(this);
  }

  addModal (modal) {
    let { modals } = this.state;
    modal._id = uid();
    modals.push(modal);
    this.setState({ modals });
    return modal._id;
  }

  removeModal (id) {
    let { modals } = this.state;
    let index = modals.findIndex(modal => modal._id === id);
    if (index < 0) return;
    modals.splice(index, 1);
    this.setState({ modals });
  }

  getChildContext () {
    const { addModal, removeModal } = this;
    return { addModal, removeModal };
  }

  renderModalWrapper () {
    const { modals } = this.state;
    const style = {
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      position: 'fixed',
      pointerEvents: 'none'
    };
    return !modals.length ? null : (
      <div style={style} className={modalBoundaryClass('Wrapper')}>
        {modals.map((modal, index) => {
          const Element = modal.render;
          return <Element key={index} />
        })}
      </div>
    );
  }

  render () {
    const { children } = this.props;
    const ModalWrapper = this.renderModalWrapper;
    const style = { position: 'relative' };
    const zIndex = (z) => ({ position: 'relative', zIndex: z });

    return (
      <div className={modalBoundaryClass() + ' MesaComponent'} style={style}>
        <div style={zIndex(1)}>
          {children}
        </div>
        <div style={zIndex(2)}>
          <ModalWrapper />
        </div>
      </div>
    );
  }
};

ModalBoundary.childContextTypes = {
  addModal: PropTypes.func,
  removeModal: PropTypes.func
};

export default ModalBoundary;
