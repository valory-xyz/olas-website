import PropTypes from 'prop-types';

export const emissionType = PropTypes.shape({
  id: PropTypes.string,
  counter: PropTypes.number,
  availableDevIncentives: PropTypes.string,
  devIncentivesTotalTopUp: PropTypes.string,
  availableStakingIncentives: PropTypes.string,
  totalStakingIncentives: PropTypes.string,
  totalBondsClaimable: PropTypes.string,
  totalBondsClaimed: PropTypes.string,
});
