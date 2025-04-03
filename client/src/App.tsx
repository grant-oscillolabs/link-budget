import React, { useState, useEffect } from 'react';

const LinkBudgetCalculator = () => {
  const [transmitPower, setTransmitPower] = useState(40); // dBm
  const [txGain, setTxGain] = useState(3); // dBi
  const [rxGain, setRxGain] = useState(2); // dBi
  const [frequency, setFrequency] = useState(100); // MHz
  const [distance, setDistance] = useState(10); // km
  const [systemLosses, setSystemLosses] = useState(2); // dB
  const [sensitivity, setSensitivity] = useState(-100); // dBm
  
  const [pathLoss, setPathLoss] = useState(0);
  const [receivedPower, setReceivedPower] = useState(0);
  const [linkMargin, setLinkMargin] = useState(0);
  const [linkStatus, setLinkStatus] = useState('');
  
  useEffect(() => {
    // Calculate wavelength in meters
    const wavelength = 300 / frequency;
    
    // Calculate path loss
    const pathLossValue = 20 * Math.log10((4 * Math.PI * distance * 1000) / wavelength);
    setPathLoss(pathLossValue.toFixed(1));
    
    // Calculate received power
    const receivedPowerValue = transmitPower + txGain + rxGain - pathLossValue - systemLosses;
    setReceivedPower(receivedPowerValue.toFixed(1));
    
    // Calculate link margin
    const linkMarginValue = receivedPowerValue - sensitivity;
    setLinkMargin(linkMarginValue.toFixed(1));
    
    // Determine link status
    if (linkMarginValue > 20) {
      setLinkStatus('Excellent - Robust link with high reliability');
    } else if (linkMarginValue > 10) {
      setLinkStatus('Good - Reliable link for most conditions');
    } else if (linkMarginValue > 5) {
      setLinkStatus('Marginal - May experience issues in adverse conditions');
    } else if (linkMarginValue > 0) {
      setLinkStatus('Poor - Unreliable, minimal functionality');
    } else {
      setLinkStatus('Failed - No communication possible');
    }
  }, [transmitPower, txGain, rxGain, frequency, distance, systemLosses, sensitivity]);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white dark:bg-slate-950 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Tactical Communications Link Budget Calculator</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Transmit Power (dBm)</label>
          <input
            type="range"
            min="20"
            max="60"
            value={transmitPower}
            onChange={(e) => setTransmitPower(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-sm mt-1">{transmitPower} dBm ({(Math.pow(10, transmitPower/10)/1000).toFixed(1)} Watts)</div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Transmitter Antenna Gain (dBi)</label>
          <input
            type="range"
            min="0"
            max="20"
            value={txGain}
            onChange={(e) => setTxGain(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-sm mt-1">{txGain} dBi</div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Receiver Antenna Gain (dBi)</label>
          <input
            type="range"
            min="0"
            max="20"
            value={rxGain}
            onChange={(e) => setRxGain(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-sm mt-1">{rxGain} dBi</div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Frequency (MHz)</label>
          <input
            type="range"
            min="30"
            max="5000"
            value={frequency}
            onChange={(e) => setFrequency(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-sm mt-1">{frequency} MHz</div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Distance (km)</label>
          <input
            type="range"
            min="1"
            max="100"
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-sm mt-1">{distance} km</div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">System Losses (dB)</label>
          <input
            type="range"
            min="0"
            max="10"
            value={systemLosses}
            onChange={(e) => setSystemLosses(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-sm mt-1">{systemLosses} dB</div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Receiver Sensitivity (dBm)</label>
          <input
            type="range"
            min="-120"
            max="-80"
            value={sensitivity}
            onChange={(e) => setSensitivity(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-sm mt-1">{sensitivity} dBm</div>
        </div>
      </div>
      
      <div className="bg-gray-100 dark:bg-slate-900 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Link Budget Results</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm">Path Loss: <span className="font-medium">{pathLoss} dB</span></p>
            <p className="text-sm">Received Power: <span className="font-medium">{receivedPower} dBm</span></p>
            <p className="text-sm">Link Margin: <span className="font-medium">{linkMargin} dB</span></p>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-1">Link Status:</p>
            <div className={`p-2 rounded text-sm ${
              linkMargin > 20 ? 'bg-green-100 text-green-800' :
              linkMargin > 10 ? 'bg-green-100 text-green-800' :
              linkMargin > 5 ? 'bg-yellow-100 text-yellow-800' :
              linkMargin > 0 ? 'bg-orange-100 text-orange-800' :
              'bg-red-100 text-red-800'
            }`}>
              {linkStatus}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-sm">
        <p className="mb-2"><strong>Note:</strong> This calculator uses the Friis transmission formula for free-space path loss. Actual tactical deployments may experience additional losses due to terrain, foliage, buildings, atmospheric conditions, jamming, or interference.</p>
      </div>
    </div>
  );
};

export default LinkBudgetCalculator;