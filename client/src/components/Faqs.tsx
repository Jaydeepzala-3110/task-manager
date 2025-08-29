// import { ChevronDown } from "lucide-react";
import { useState } from "react";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<null | number>(null);

  const faqs = [
    {
      question: "How do I get started with Taskify?",
      answer:
        "Simply sign up for a free account and start creating your first tasks. You can organize them by priority, assign due dates, and use our smart filters to stay organized.",
    },
    {
      question: "Can I collaborate with my team?",
      answer:
        "Yes! Taskify is built for team collaboration. Admins can see all tasks while team members can manage their own tasks and see shared projects.",
    },
    {
      question: "What makes the filters 'smart'?",
      answer:
        "Our filters allow you to sort and search by multiple criteria simultaneously - status, priority, assignee, due dates, and tags - helping you find exactly what you need instantly.",
    },
    {
      question: "Is there a mobile app?",
      answer:
        "Currently, Taskify is a responsive web application that works perfectly on mobile browsers. A dedicated mobile app is in development.",
    },
    {
      question: "How secure is my data?",
      answer:
        "We use enterprise-grade security with encrypted data transmission and storage. Your tasks and personal information are protected with industry-standard security measures.",
    },
  ];

  return (
    <section className="bg-black py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400 text-lg lg:text-xl max-w-2xl mx-auto">
            Everything you need to know about Taskify
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-700 rounded-xl bg-gray-900/60 backdrop-blur overflow-hidden hover:border-gray-600 transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-800/40 transition-colors"
              >
                <span className="font-semibold text-white text-base lg:text-lg pr-4">
                  {faq.question}
                </span>
                {/* <ChevronDown
                  className={`text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  size={20}
                /> */}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5">
                  <div className="pt-2 border-t border-gray-700">
                    <p className="text-gray-300 leading-relaxed mt-3">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
