import { useState } from 'react'
import { FaReact } from "react-icons/fa";
import { SiVite } from "react-icons/si";
import { FcLink } from "react-icons/fc";

function App() {
  // State hooks for form inputs and options
  const [baseUrl, setBaseUrl] = useState('');
  const [utmSource, setUtmSource] = useState('');
  const [utmMedium, setUtmMedium] = useState('');
  const [utmCampaign, setUtmCampaign] = useState('');
  const [utmTerm, setUtmTerm] = useState('');
  const [utmContent, setUtmContent] = useState('');
  const [option, setOption] = useState('basic'); // 'basic' or 'detailed'
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [copyFeedback, setCopyFeedback] = useState('');

  // Handle option change (Basic/Detailed)
  const handleOptionChange = (event) => {
    setOption(event.target.value);
    // Clear detailed fields when switching back to basic
    if (event.target.value === 'basic') {
      setUtmTerm('');
      setUtmContent('');
    }
  };

  // Handle input changes
  const handleInputChange = (setter) => (event) => {
    setter(event.target.value);
  };

  // Generate the UTM link
  const generateLink = () => {
    // Basic validation
    if (!baseUrl.trim()) {
      alert('Please enter the Website URL.');
      return;
    }
    if (!utmSource.trim() || !utmMedium.trim() || !utmCampaign.trim()) {
      alert('Source, Medium, and Campaign parameters are required. Please fill them in.');
      return;
    }

    let utmParams = [];

    // Add required parameters
    utmParams.push(`utm_source=${encodeURIComponent(utmSource.trim())}`);
    utmParams.push(`utm_medium=${encodeURIComponent(utmMedium.trim())}`);
    utmParams.push(`utm_campaign=${encodeURIComponent(utmCampaign.trim())}`);

    // If detailed mode and values exist, add optional parameters
    if (option === 'detailed') {
      if (utmTerm.trim()) {
        utmParams.push(`utm_term=${encodeURIComponent(utmTerm.trim())}`);
      }
      if (utmContent.trim()) {
        utmParams.push(`utm_content=${encodeURIComponent(utmContent.trim())}`);
      }
    }

    // Construct the final URL
    let finalUrl = baseUrl.trim();
    if (utmParams.length > 0) {
      // Check if base URL already has parameters
      const separator = finalUrl.includes('?') ? '&' : '?';
      finalUrl += separator + utmParams.join('&');
    }

    // Display the generated URL
    setGeneratedUrl(finalUrl);
    setCopyFeedback(''); // Clear feedback message
  };

  // Copy the generated link to clipboard
  const copyLink = () => {
    if (!generatedUrl) {
      alert('Please generate a link first!');
      return;
    }

    navigator.clipboard.writeText(generatedUrl).then(function() {
      // Success feedback
      setCopyFeedback('Copied!');
      // Clear feedback after a few seconds
      setTimeout(() => {
        setCopyFeedback('');
      }, 2000);
    }).catch(function(err) {
      // Error feedback
      console.error('Failed to copy: ', err);
      setCopyFeedback('Copy Failed!');
      // Fallback for older browsers (less reliable)
      try {
        const textArea = document.createElement('textarea');
        textArea.value = generatedUrl;
        // Move text area outside the visible area
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
        setCopyFeedback('Copied (fallback)!');
        setTimeout(() => {
          setCopyFeedback('');
        }, 2000);
      } catch (err) {
        console.error('Fallback copy failed: ', err);
        setCopyFeedback('Manual Copy Required!');
      }
    });
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="container max-w-xl w-full bg-white p-6 rounded-xl shadow-lg text-sm">
        <h1 className="text-2xl font-bold text-center flex items-center justify-center gap-5 text-gray-800 mb-6"><FcLink /> UTM Link Generator</h1>
        <p className='text-center max-w-40'>If you need more information about UTM parameters, please read my <a href='https://www.ozayozdemir.com/blog/understanding-utm-parameters/' target='_blank'>blog post here</a>.</p>

        {/* Options */}
        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2">Options:</label>
          <div className="flex flex-col gap-3">
            <label className="inline-flex items-center text-gray-700 cursor-pointer">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="utmOption"
                value="basic"
                checked={option === 'basic'}
                onChange={handleOptionChange}
              />
              <span className="ml-2 font-bold">Basic <span className='text-xs font-normal'>(Source, Medium, Campaign)</span></span>
            </label>
            <label className="inline-flex items-center text-gray-700 cursor-pointer">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="utmOption"
                value="detailed"
                checked={option === 'detailed'}
                onChange={handleOptionChange}
              />
              <span className="ml-2 font-bold">Detailed <span className='text-xs font-normal'>(+ Term, Content)</span></span>
            </label>
          </div>
        </div>

        {/* Base URL */}
        <div className="mb-5">
          <label htmlFor="baseUrl" className="block text-gray-700 font-bold mb-2 required-label">
            Website URL <span className='font-normal'>(e.g., https://yoursite.com/page)</span>
          </label>
          <input
            type="text"
            id="baseUrl"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., https://yoursite.com"
            value={baseUrl}
            onChange={handleInputChange(setBaseUrl)}
          />
        </div>

        {/* UTM Source */}
        <div className="mb-5">
          <label htmlFor="utmSource" className="block text-gray-700 font-bold mb-2 required-label">
            UTM Source <span className='font-normal'>(e.g., google, facebook, newsletter)</span>
          </label>
          <input
            type="text"
            id="utmSource"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., google"
            value={utmSource}
            onChange={handleInputChange(setUtmSource)}
          />
        </div>

        {/* UTM Medium */}
        <div className="mb-5">
          <label htmlFor="utmMedium" className="block text-gray-700 font-bold mb-2 required-label">
            UTM Medium <span className='font-normal'>(e.g., cpc, social, email)</span>
          </label>
          <input
            type="text"
            id="utmMedium"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., social"
            value={utmMedium}
            onChange={handleInputChange(setUtmMedium)}
          />
        </div>

        {/* UTM Campaign */}
        <div className="mb-5">
          <label htmlFor="utmCampaign" className="block text-gray-700 font-bold mb-2 required-label">
            UTM Campaign (e.g., spring_sale, product_launch)
          </label>
          <input
            type="text"
            id="utmCampaign"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., spring_sale"
            value={utmCampaign}
            onChange={handleInputChange(setUtmCampaign)}
          />
        </div>

        {/* Detailed Options (conditionally rendered) */}
        {option === 'detailed' && (
          <div id="detailedOptions">
            {/* UTM Term */}
            <div className="mb-5">
              <label htmlFor="utmTerm" className="block text-gray-700 font-bold mb-2">
                UTM Term (e.g., running+shoes - usually for paid search)
              </label>
              <input
                type="text"
                id="utmTerm"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., running+shoes"
                value={utmTerm}
                onChange={handleInputChange(setUtmTerm)}
              />
            </div>

            {/* UTM Content */}
            <div className="mb-5">
              <label htmlFor="utmContent" className="block text-gray-700 font-bold mb-2">
                UTM Content (e.g., banner_top, textlink_bottom)
              </label>
              <input
                type="text"
                id="utmContent"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., banner_top"
                value={utmContent}
                onChange={handleInputChange(setUtmContent)}
              />
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-5">
          <button
            onClick={generateLink}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out"
          >
            Generate Link
          </button>
          <button
            onClick={copyLink}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200 ease-in-out"
          >
            Copy Link
          </button>
        </div>
         {/* Copy Feedback */}
         {copyFeedback && (
             <div className="text-center text-green-600 font-semibold mb-4">
                 {copyFeedback}
             </div>
         )}


        {/* Generated URL Display */}
        <div>
          <label htmlFor="outputUrlDisplay" className="block text-gray-700 font-bold mb-2">
            Generated URL:
          </label>
          <div
            id="outputUrlDisplay"
            className="w-full p-4 border border-gray-300 bg-gray-200 rounded-md break-all font-mono text-gray-800 select-all cursor-text overflow-x-auto"
          >
            {generatedUrl || 'Your generated URL will appear here.'}
          </div>
        </div>

      </div>
      <div className="text-center text-gray-500 text-xs mt-4">
        <p className='flex items-center justify-center gap-1.5'>Made with ☕, <FaReact /> & <SiVite />  by <a href="https://www.ozayozdemir.com" target='_blank' className="text-blue-500 hover:underline">Ozay Ozdemir</a></p>
        <p>Source code available on <a href="#" className="text-blue-500 hover:underline">GitHub</a></p>
        <p>Icons by <a href="https://react-icons.github.io/react-icons/" target='_blank' className="text-blue-500 hover:underline">React Icons</a></p>
      </div>
    </div>
  );
}

export default App;

