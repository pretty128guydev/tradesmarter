import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { Modal } from './styled'
import { actionCloseModal } from '../../../actions/modal'
import { Overlay } from '@react-md/overlay'
import { isArray } from 'lodash'

interface IOpenAccountModalProps {
  colors: any
  partnerConfig: any
  actionCloseModal: () => void
}

const OpenAccountModal = (props: IOpenAccountModalProps) => {
  const { actionCloseModal, partnerConfig } = props
  const { registrationLink, openAccountButton } = partnerConfig
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    window.addEventListener('message', (event) => {
      if (event.data === 'close-modal-registration') {
        actionCloseModal()
        return
      }
      if (
        event.data === 'registration-form-loaded' &&
        iframeRef.current?.contentWindow
      ) {
        iframeRef.current.contentWindow.postMessage(
          'transparent-registration-form',
          '*'
        )
        return
      }
    })

    return () => {
      window.removeEventListener('message', () => {})
    }
  }, [])

  const openAccountBtn = isArray(openAccountButton)
    ? openAccountButton[0]
    : openAccountButton

  return (
    <>
      <Modal>
        <iframe
          ref={iframeRef}
          src={openAccountBtn?.link || registrationLink}
          title="Open Account iframe"
          frameBorder="0"
          height="100%"
          width="100%"
        />
      </Modal>
      <Overlay
        id="modal-overlay"
        visible={true}
        onRequestClose={actionCloseModal}
        style={{ zIndex: 40 }}
      />
    </>
  )
}
const mapStateToProps = (state: any) => ({
  colors: state.theme,
  partnerConfig: state.registry.data.partnerConfig,
})

export default connect(mapStateToProps, {
  actionCloseModal,
})(OpenAccountModal)
