import React from 'react'

const MermaidIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    {...props}
  >
    <rect width="28" height="28" rx="6" fill="#FF3670" />
    <path
      d="M21.9927 7.40992C18.4544 7.25848 15.2054 9.43558 14 12.7657C12.7945 9.43558 9.5455 7.25848 6.00716 7.40992C5.88929 10.2177 7.23251 12.8952 9.55372 14.4794C10.7432 15.2964 11.454 16.6514 11.45 18.0944V20.5975H16.5504V18.0944C16.5462 16.6515 17.2569 15.2964 18.4462 14.4794C20.768 12.8958 22.1115 10.2179 21.9927 7.40992Z"
      fill="white"
    />
  </svg>
)

const ZoomInIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 18 18"
    {...props}
  >
    <path
      d="M12 9H6M9 6V12M9 2C14.6 2 16 3.4 16 9C16 14.6 14.6 16 9 16C3.4 16 2 14.6 2 9C2 3.4 3.4 2 9 2Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
)

const ZoomOutIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 18 18"
    {...props}
  >
    <path
      d="M6.66667 9H11.3333M9 2C14.6 2 16 3.4 16 9C16 14.6 14.6 16 9 16C3.4 16 2 14.6 2 9C2 3.4 3.4 2 9 2Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
)

const ResetIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 18 18"
    {...props}
  >
    <path
      d="M2.04663 9.77802C2.23746 11.484 3.04863 13.0603 4.32586 14.2072C5.60309 15.3541 7.25729 15.9915 8.97386 15.9983C10.6904 16.0051 12.3496 15.3808 13.6359 14.244C14.9222 13.1073 15.7458 11.5375 15.9502 9.8331C16.1545 8.12871 15.7253 6.40867 14.7442 5.0001C13.7631 3.59152 12.2985 2.59267 10.6289 2.1935C8.95942 1.79433 7.20141 2.02269 5.68927 2.83515C4.17713 3.64762 3.01634 4.9875 2.42765 6.59999"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M2 2.78046V6.66843H5.88796M8.22074 9.00044C8.22074 9.20667 8.30266 9.40445 8.44849 9.55028C8.59432 9.69611 8.7921 9.77803 8.99833 9.77803C9.20456 9.77803 9.40234 9.69611 9.54817 9.55028C9.694 9.40445 9.77592 9.20667 9.77592 9.00044C9.77592 8.79421 9.694 8.59642 9.54817 8.4506C9.40234 8.30477 9.20456 8.22284 8.99833 8.22284C8.7921 8.22284 8.59432 8.30477 8.44849 8.4506C8.30266 8.59642 8.22074 8.79421 8.22074 9.00044Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
)

interface MermaidControlProps {
  type: string
  error: Error | null
  panZoom: boolean
  onZoomIn: () => void
  onZoomOut: () => void
  onReset: () => void
}

const MermaidControl: React.FC<MermaidControlProps> = ({
  type,
  error,
  panZoom,
  onZoomIn,
  onZoomOut,
  onReset
}) => (
  <div className="control-block">
    <header>
      <MermaidIcon />
      <div className="type">
        <div className="title">
          <div>Type</div>
        </div>
        <div className={`value value-${error ? 'error' : 'normal'}`}>
          <div>{error ? 'error' : type}</div>
        </div>
      </div>
    </header>
    {!error && panZoom && (
      <div className="controls">
        <button onClick={onZoomIn}>
          <ZoomInIcon />
        </button>
        <button onClick={onReset}>
          <ResetIcon />
        </button>
        <button onClick={onZoomOut}>
          <ZoomOutIcon />
        </button>
      </div>
    )}
  </div>
)

MermaidControl.displayName = 'MermaidControl'

export default MermaidControl
