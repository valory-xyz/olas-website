import React from 'react';

const DATA_ROWS = [
  // ... (DATA_ROWS content remains unchanged)
];

const getChainType = type => (type ? 'ON-CHAIN' : 'OFF-CHAIN');

const WhyAutonolas = () => (
  <div className="section section-3" id="what-are-autonomous-services">
    <h2>WHAT ARE AUTONOMOUS SERVICES?</h2>
    <div
      className="header"
    >
          Decentralized&nbsp;
          <br />
          <span className="sub-text">and</span>
          &nbsp;
          <span className="ib">Sophisticated</span>
    </div>

    <h2>Software services you can build and own. Build with the best of smart
    contracts and Web2 apps.</h2>

    <div className="comparison-table">
      <table>
        <thead>
          <tr>
            <th aria-label=" " />
            <th>Autonomous Services</th>
            <th>Smart Contracts</th>
            <th>Web Services</th>
            <th>
              Custom Decentralized
              <div>Services (e.g. Oracles)</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {DATA_ROWS.map(
            ({
              id,
              name,
              webServices,
              decentralizedService,
              smartContractService,
            }) => {
              if (id === 'location') {
                return (
                  <tr key={id}>
                    <td>{name}</td>
                    <td>OFF-CHAIN</td>
                    <td>{getChainType(smartContractService)}</td>
                    <td>{getChainType(webServices)}</td>
                    <td>{getChainType(decentralizedService)}</td>
                  </tr>
                );
              }

              return (
                <tr key={id}>
                  <td>{name}</td>
                  <td>
                    <div className="autonolas-service" />
                  </td>
                  <td>{smartContractService ? <div className="yes" /> : <div className="no" />}</td>
                  <td>{webServices ? <div className="yes" /> : <div className="no" />}</td>
                  <td>{decentralizedService ? <div className="yes" /> : <div className="no" />}</td>
                </tr>
              );
            },
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default WhyAutonolas;
