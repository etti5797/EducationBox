import React from "react";

const Loading = ({ isLoading }) => {
  return (
    <div>
      {isLoading && (
        <div className="loading">
            <span className="loading">Loading...</span>
        </div>
      )}
    </div>
  );
};

export default Loading;