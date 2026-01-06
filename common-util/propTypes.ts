import PropTypes from 'prop-types';

export const VideoPropTypes = PropTypes.shape({
  date: PropTypes.string,
  title: PropTypes.string,
  platform: PropTypes.string,
  drive_link: PropTypes.string,
  video_url: PropTypes.string,
  platform_link: PropTypes.string,
  filename: PropTypes.string,
});

export const TrusteeQuotePropTypes = PropTypes.shape({
  quote: PropTypes.string.isRequired,
  userIcon: PropTypes.string,
  icon: PropTypes.string.isRequired,
  xUrl: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string,
}).isRequired;
