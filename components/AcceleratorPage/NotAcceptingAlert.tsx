const InfoCircleFilled = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M10 1.25C5.16797 1.25 1.25 5.16797 1.25 10C1.25 14.832 5.16797 18.75 10 18.75C14.832 18.75 18.75 14.832 18.75 10C18.75 5.16797 14.832 1.25 10 1.25ZM10.625 14.2188C10.625 14.3047 10.5547 14.375 10.4688 14.375H9.53125C9.44531 14.375 9.375 14.3047 9.375 14.2188V8.90625C9.375 8.82031 9.44531 8.75 9.53125 8.75H10.4688C10.5547 8.75 10.625 8.82031 10.625 8.90625V14.2188ZM10 7.5C9.75467 7.49499 9.52108 7.39402 9.34935 7.21875C9.17763 7.04348 9.08144 6.80788 9.08144 6.5625C9.08144 6.31712 9.17763 6.08152 9.34935 5.90625C9.52108 5.73098 9.75467 5.63001 10 5.625C10.2453 5.63001 10.4789 5.73098 10.6506 5.90625C10.8224 6.08152 10.9186 6.31712 10.9186 6.5625C10.9186 6.80788 10.8224 7.04348 10.6506 7.21875C10.4789 7.39402 10.2453 7.49499 10 7.5Z"
      fill="#1677FF"
    />
  </svg>
);

export const NotAcceptingAlert = ({ className = '' }: { className?: string }) => (
  <div
    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm ${className}`}
    style={{ backgroundColor: '#E6F4FF', borderColor: '#91CAFF', color: '#003EB3' }}
  >
    <InfoCircleFilled />
    Olas Accelerator is not accepting new applications at this time.
  </div>
);
