import React, { useEffect } from 'react';

const AdSense = ({ adSlot, style }) => {
  useEffect(() => {
    try {
      // Push the command to load ads
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={style || { display: 'block', textAlign: 'center' }}
      data-ad-client="ca-pub-1181142291783508"
      data-ad-slot={adSlot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
};

export default AdSense;
