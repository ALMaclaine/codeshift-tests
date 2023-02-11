import { EnderButton } from 'components/utils/ender-button-v2.jsx';
import { EnderModal } from 'components/utils/ender-modal.jsx';
import React, { useState } from 'react';
import { emptyFn } from 'utils.mjs';

const CreateReceipt = React.lazy(() =>
  import('accounting/check-receipts/create-receipt.jsx')
);

export function AddCheckButton({ onSuccess = emptyFn }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex-justify">
      <EnderModal onClose={() => setIsModalOpen(false)} opened={isModalOpen}>
        <CreateReceipt
          onSuccess={(keepModalOpen) => {
            setIsModalOpen(keepModalOpen);
            onSuccess();
          }}
          title={'Mark Check as Received'}
        />
      </EnderModal>
      <EnderButton onClick={() => setIsModalOpen(true)}>Add Check</EnderButton>
    </div>
  );
}
