export default function LessonContent({ sections }) {
  return (
    <section className="space-y-6">
      {sections.map((section) => (
        <div key={section.heading}>
          <h2 className="font-h2 text-h2 text-primary">{section.heading}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 32)} className="font-body-md text-body-md text-on-surface leading-relaxed mt-4">
              {paragraph}
            </p>
          ))}
        </div>
      ))}
    </section>
  );
}
