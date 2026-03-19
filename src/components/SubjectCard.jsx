import React from 'react';

const SubjectCard = ({ subject }) => {
  return (
    <div className="subject-card">
      <h3>{subject?.name}</h3>
      <p>{subject?.description}</p>
    </div>
  );
};

export default SubjectCard;
