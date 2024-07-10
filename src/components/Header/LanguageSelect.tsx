/**
 * Implements a language selector list
 */
import React, { useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { IRegistry } from '../../core/API'
import UserStorage from '../../core/UserStorage'
import Backdrop from '../Backdrop'
import { LanguageList } from '../ui/LanguageList'

const LanguageBar = styled.div<any>`
  flex: 0 1 150px;
  position: relative;

  font-size: 13px;
  letter-spacing: -0.22px;
  cursor: default;
  color: ${(props) => props.colors.primary};

  img {
    vertical-align: middle;
    width: 24px;
    height: 24px;
    margin-right: 5px;
  }

  span {
    padding-left: 10px;
    color: ${(props) => props.colors.primaryText};
  }
`
const ListHolder = styled.div<any>`
    z-index: 100;
    position: absolute;
    padding: 10px 0;
    border-radius: 2px;
    box-shadow: 0 2px 10px 0 rgba(20, 31, 44, 0.8);
    background-color: ${(props) => props.colors.modalBackground};
    color: ${(props) => props.colors.secondaryText};

    max-height: 300px;
    overflow: auto;
}
`
interface ILanguageSelectProps {
  colors: any
  data: IRegistry
}

const LanguageSelect = (props: ILanguageSelectProps) => {
  const [picker, setPicker] = useState<boolean>(false)
  const { langs } = props.data
  const lang = UserStorage.getLanguage() || props.data.lang

  const title = langs[lang]?.name

  return (
    <LanguageBar colors={props.colors}>
      <div onClick={() => setPicker(true)}>
        <img
          src={`${process.env.PUBLIC_URL}/static/icons/languages/${lang}.svg`}
          alt={`select a ${lang}`}
        />
        {title}
        <span>▾</span>
      </div>
      {picker && (
        <>
          <Backdrop onClick={() => setPicker(false)} />
          <ListHolder colors={props.colors} className="scrollable">
            <LanguageList langs={langs} onSelect={() => setPicker(false)} />
          </ListHolder>
        </>
      )}
    </LanguageBar>
  )
}

const mapStateToProps = (state: any) => ({ data: state.registry.data })

export default connect(mapStateToProps)(LanguageSelect)
