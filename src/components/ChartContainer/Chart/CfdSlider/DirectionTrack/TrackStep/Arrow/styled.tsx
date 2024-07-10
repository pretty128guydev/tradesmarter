import styled from 'styled-components'

const ArrowContainer = styled.div``

const ArrowFooter = styled.div`
	height: 10px;
	background-image: url('cfd-ladder-track.png');
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
`

const Arrow = styled.div<{ backgroundColor: string }>`
	width: 0;
	height: 0;
	border-left: 25px solid transparent;
	border-right: 25px solid transparent;
`

const ArrowUp = styled(Arrow)`
	border-bottom: 18px solid ${(props) => props.backgroundColor};
`

const ArrowBottom = styled(Arrow)`
	border-top: 18px solid ${(props) => props.backgroundColor}; ;
`

export { ArrowContainer, ArrowFooter, ArrowUp, ArrowBottom }
