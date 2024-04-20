import React, { useState } from 'react';
import './FAQAccordion.scss'; // Import SCSS for styles

const FAQAccordion = ({ faqs }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = index => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className='FAQWrapper'>
      <p>
        FAQ
      </p>
      <ul className="accordion">
        {faqs.map((faq, index) => (
          <li key={index} className="accordion-item">
            <button onClick={() => toggleFAQ(index)} className="accordion-title">
              {faq.title}
              <span className="plus">{activeIndex === index ? '-' : '+'}</span>
            </button>
            <div className={`accordion-content ${activeIndex === index ? 'show' : ''}`}>
              {faq.content}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FAQAccordion;