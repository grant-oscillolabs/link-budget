import React, { useState, useEffect } from 'react';

const LinkBudgetCalculator = () => {
  const [transmitPower, setTransmitPower] = useState(40); // dBm
  const [txGain, setTxGain] = useState(3); // dBi
  const [rxGain, setRxGain] = useState(2); // dBi
  const [frequency, setFrequency] = useState(100); // MHz
  const [distance, setDistance] = useState(10); // km
  const [systemLosses, setSystemLosses] = useState(2); // dB
  const [sensitivity, setSensitivity] = useState(-100); // dBm
  
  // --- compute everything on the fly ---
  const wavelength = 300 / frequency;                              // in metres
  const pathLossValue = 20 * Math.log10((4 * Math.PI * distance * 1000) / wavelength);
  const receivedPowerValue = transmitPower + txGain + rxGain - pathLossValue - systemLosses;
  const linkMarginValue = receivedPowerValue - sensitivity;

  // --- status logic ---
  let linkStatus;
  if (linkMarginValue > 20)       linkStatus = 'Excellent - Robust link';
  else if (linkMarginValue > 10)  linkStatus = 'Good - Reliable in most conditions';
  else if (linkMarginValue > 5)   linkStatus = 'Marginal - May struggle in adverse';
  else if (linkMarginValue > 0)   linkStatus = 'Poor - Unreliable';
  else                             linkStatus = 'Failed - No comms possible';

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
      
      {/* Formulas Panel */}
      <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg mb-6">
        <h3 className="font-medium mb-2">Formulas</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>
            <strong>Wavelength λ</strong>:  
            λ = 300 / f = 300&nbsp;/&nbsp;{frequency} MHz = <strong>{wavelength.toFixed(2)} m</strong>
          </li>
          <li>
            <strong>Free‐space Path Loss PL</strong>:  
            PL(dB) = 20 log₁₀( (4π·R) / λ )  
            = 20 log₁₀( (4π·{distance * 1000} m) / {wavelength.toFixed(2)} m )  
            = <strong>{pathLossValue.toFixed(1)} dB</strong>
          </li>
          <li>
            <strong>Received Power P<sub>r</sub></strong>:  
            P<sub>r</sub>(dBm) = P<sub>t</sub> + G<sub>t</sub> + G<sub>r</sub> − PL − L  
            = {transmitPower} + {txGain} + {rxGain} − {pathLossValue.toFixed(1)} − {systemLosses}  
            = <strong>{receivedPowerValue.toFixed(1)} dBm</strong>
          </li>
          <li>
            <strong>Link Margin</strong>:  
            Margin = P<sub>r</sub> − Sensitivity  
            = {receivedPowerValue.toFixed(1)} − ({sensitivity})  
            = <strong>{linkMarginValue.toFixed(1)} dB</strong>
          </li>
        </ol>
      </div>

      {/* Results Panel */}
      <div className="bg-gray-100 dark:bg-slate-900 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Link Budget Results</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-sm space-y-1">
            <p>Path Loss: <span className="font-medium">{pathLossValue.toFixed(1)} dB</span></p>
            <p>Received Power: <span className="font-medium">{receivedPowerValue.toFixed(1)} dBm</span></p>
            <p>Link Margin: <span className="font-medium">{linkMarginValue.toFixed(1)} dB</span></p>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Link Status:</p>
            <div className={`p-2 rounded text-sm ${
              linkMarginValue > 20 ? 'bg-green-100 text-green-800' :
              linkMarginValue > 10 ? 'bg-green-100 text-green-800' :
              linkMarginValue > 5  ? 'bg-yellow-100 text-yellow-800' :
              linkMarginValue > 0  ? 'bg-orange-100 text-orange-800' :
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