import "@babel/polyfill";
import React from 'react'
import App from 'next/app'

import SamsungWtbHead from '../components/SamsungWtbHead'

import '../styles.scss'

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  render () {
    const { Component, pageProps } = this.props;

    return (
      <React.Fragment>
        <SamsungWtbHead />
        <Component {...pageProps} />
        <script src="/static/js/s_code_microsite.js" />
      </React.Fragment>
    )
  }
}

export default MyApp