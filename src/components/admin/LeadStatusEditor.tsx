"use client";

import {
  LeadStatus,
} from "@/generated/prisma/enums";

import {
  AdminSelect,
  type AdminSelectOption,
} from "@/components/admin/AdminSelect";

type LeadStatusEditorProps = {
  leadId: string;
  status:
    LeadStatus;
};

function statusLabel(
  value: string,
): string {
  return value
    .toLowerCase()
    .replaceAll(
      "_",
      " ",
    )
    .replace(
      /\b\w/g,
      (
        character,
      ) =>
        character.toUpperCase(),
    );
}

const options:
  AdminSelectOption[] =
  Object.values(
    LeadStatus,
  ).map(
    (
      status,
    ) => ({
      value:
        status,

      label:
        statusLabel(
          status,
        ),
    }),
  );

export function LeadStatusEditor({
  leadId,
  status,
}: LeadStatusEditorProps) {
  return (
    <form
      method="POST"
      action="/api/admin/leads/status"
      className="
        flex
        min-w-[210px]
        items-center
        gap-2
      "
    >
      <input
        type="hidden"
        name="leadId"
        value={leadId}
      />

      <div
        className="
          min-w-[140px]
          flex-1
        "
      >
        <AdminSelect
          name="status"
          options={options}
          defaultValue={status}
          compact
        />
      </div>

      <button
        type="submit"
        className="
          h-[36px]
          rounded-[9px]
          border
          border-white/[0.11]
          bg-[#162026]
          px-3
          text-[10px]
          font-semibold
          text-white/45
          transition-all

          hover:border-[#FF6B36]/25
          hover:bg-[#1A252B]
          hover:text-[#FF8054]
        "
      >
        Save
      </button>
    </form>
  );
}