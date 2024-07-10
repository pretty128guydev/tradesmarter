/**
 * Generic backdrop to be used under the modals and panels to unfocus
 */
import styled from 'styled-components'

const Backdrop = styled.div<{ zIndex?: number }>`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: ${(props) => props.zIndex ?? 40};
	display: block;
	float: left;
`
const SidebarBackdrop = styled(Backdrop)`
	left: 62px;
`

export default Backdrop
export { SidebarBackdrop }
