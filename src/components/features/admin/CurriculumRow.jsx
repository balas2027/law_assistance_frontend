import StatusPill from './StatusPill';

export default function CurriculumRow({ row }) {
  return (
    <tr className="hover:bg-surface-container-low transition-colors group cursor-pointer">
      <td className="px-6 py-4">
        <div className="font-body-md text-body-md font-medium text-primary mb-1">{row.title}</div>
        <div className="font-citation text-citation text-on-surface-variant text-[12px]">{row.code}</div>
      </td>
      <td className="px-6 py-4">
        <StatusPill status={row.status} />
      </td>
      <td className="px-6 py-4 font-body-md text-body-md text-on-surface-variant hidden sm:table-cell">{row.author}</td>
      <td className="px-6 py-4 font-citation text-citation text-on-surface-variant text-[13px] text-right">
        {row.lastUpdated}
      </td>
    </tr>
  );
}
