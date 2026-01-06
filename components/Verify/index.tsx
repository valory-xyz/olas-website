import { ArrowUpRight } from 'lucide-react';
import PropTypes from 'prop-types';

const Verify = ({ url, text = 'Verify' }) => (
  <a
    href={url}
    className="flex items-center gap-1 text-slate-400 border-b border-slate-400 max-w-max"
    rel="noopener noreferrer"
    target="_blank"
  >
    {text} <ArrowUpRight size={20} />
  </a>
);

Verify.propTypes = {
  url: PropTypes.string.isRequired,
};

export default Verify;
