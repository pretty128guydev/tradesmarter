/**
 * This is entry component
 * Mobile, Desktop are lazy-loaded bundles
 */
import React, { Suspense } from 'react'
import { connect } from 'react-redux'
import { ThemeContextConsumer } from './components/ThemeContext'
import { isLoggedIn } from './components/selectors/loggedIn'
import GlobalLoader from './components/ui/GlobalLoader/index'
import './core/i18n'
import { SidebarState } from './reducers/sidebar'
import { actionSetSidebar } from './actions/sidebar'

export const Background = ({ children, isMobile }: any) => (
  <ThemeContextConsumer>
    {(context) => (
      <div
        className={`column_container hide_scroll_bar ${
          isMobile ? 'flex-column' : ''
        }`}
        style={{
          backgroundColor: isMobile
            ? context.panelBackground
            : context.background,
        }}
      >
        {children}
      </div>
    )}
  </ThemeContextConsumer>
)

/**so 

 * Hide header:
 * a) if xprops are defined
 * b) Hide header if noheader present in search
 * @returns
 */
const shouldShowHeader = () => {
  const { xprops } = window as any

  if (xprops && !xprops.header) {
    return false
  }
  // Hide header   for EM
  if (
    window.location.search.includes('noheader') ||
    window.location.search.includes('hideHeader=1')
  ) {
    return false
  }
  return true
}

const App = ({
  inTradingHours,
  isMobile,
  loading,
  isLoggedIn,
  theme,
  themeReady,
  actionSetSidebar,
}: any) => {
  const showHeader = shouldShowHeader()

  if (!themeReady) {
    return <Background />
  }

  if (loading) {
    return <GlobalLoader />
  }

  if (isMobile) {
    const MobileApp = React.lazy(() => import('./MobileApp'))
    return (
      <Suspense fallback={<GlobalLoader />}>
        <MobileApp
          inTradingHours={inTradingHours}
          colors={theme}
          showHeader={showHeader}
          onHidePositionsPanel={() => actionSetSidebar(SidebarState.none)}
          isLoggedIn={isLoggedIn}
        />
      </Suspense>
    )
  }

  const DesktopApp = React.lazy(() => import('./DesktopApp'))
  return (
    <Suspense fallback={<GlobalLoader />}>
      <DesktopApp
        showHeader={showHeader}
        theme={theme}
        isLoggedIn={isLoggedIn}
      />
    </Suspense>
  )
}

const mapStateToProps = (state: any) => ({
  isLoggedIn: isLoggedIn(state),
  loading: state.registry.loading,
  isMobile: state.registry.isMobile,
  theme: state.theme,
  themeReady: state.registry.themeReady,
  inTradingHours: state.trading.inTradingHours,
})

export default connect(mapStateToProps, { actionSetSidebar })(App)
