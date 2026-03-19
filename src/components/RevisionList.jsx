import React from 'react';

const RevisionList = ({ revisions }) => {
  return (
    <div className="revision-list">
      <h3>Revisions</h3>
      <ul>
        {revisions?.map((revision) => (
          <li key={revision?.id}>{revision?.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default RevisionList;
