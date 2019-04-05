import React from 'react'
import NextHead from 'next/head'
import settings from '../settings'

class SamsungWtbHead extends React.Component {
  setGoogleTags = () => {
    return {
      __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
      `
    };
  };

  render() {
    return (
      <NextHead>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="icon" href="/static/favicon.ico" />
        <link rel="stylesheet" href="/static/css/fonts.css" />
        <title>{this.props.title || ''}</title>

        <script async src={`https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalyticsId}`}/>
        <script dangerouslySetInnerHTML={this.setGoogleTags()} />
      </NextHead>
    );
  }
}

export default SamsungWtbHead
