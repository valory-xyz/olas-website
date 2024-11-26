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
