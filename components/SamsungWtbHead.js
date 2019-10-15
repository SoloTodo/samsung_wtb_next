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

        <script
          src="https://code.jquery.com/jquery-3.4.1.min.js"
          integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo="
          crossOrigin="anonymous"
        />
        <script
          src="//assets.adobedtm.com/2f39014c5d5172df150d19eb00fe42ddba079437/satelliteLib-3030d330553ce52754fa9eb32fc5571e4f383778.js"
        />
      </NextHead>
    );
  }
}

export default SamsungWtbHead
