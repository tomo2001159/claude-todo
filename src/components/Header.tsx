import { CheckSquare, Plus, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  onToggleForm: () => void;
  showForm: boolean;
}

export default function Header({ onToggleForm, showForm }: Props) {
  return (
    <header className="header">
      <div className="header-left">
        <div className="header-icon">
          <CheckSquare size={18} strokeWidth={2.5} />
        </div>
        <h1 className="header-title">Todo</h1>
      </div>

      <motion.button
        className={`btn-new ${showForm ? 'active' : ''}`}
        onClick={onToggleForm}
        whileTap={{ scale: 0.95 }}
      >
        <motion.span
          animate={{ rotate: showForm ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ display: 'flex' }}
        >
          {showForm ? <X size={14} strokeWidth={2.5} /> : <Plus size={14} strokeWidth={2.5} />}
        </motion.span>
        {showForm ? 'キャンセル' : '新しいタスク'}
      </motion.button>
    </header>
  );
}
