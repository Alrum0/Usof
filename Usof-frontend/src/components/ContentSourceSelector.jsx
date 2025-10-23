import { motion, AnimatePresence } from 'framer-motion';

export default function ContentSourceSelector({
  isOpen,
  onClose,
  onSelectSource,
}) {
  const handleSelect = (source) => {
    onSelectSource(source);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          className='absolute top-10 right-0 bg-[var(--color-background-secondary)]
                     border border-[var(--color-border)] rounded-xl shadow-lg w-56 z-50'
        >
          <ul className='flex flex-col py-2 px-2'>
            <li
              className='px-4 py-2 text-white hover:bg-[#2f2f2f] hover:rounded-lg cursor-pointer font-medium'
              onClick={() => handleSelect('Для вас')}
            >
              Для вас
            </li>
            <li
              className='px-4 py-2 text-white hover:bg-[#2f2f2f] hover:rounded-lg cursor-pointer font-medium'
              onClick={() => handleSelect('Відстежуються')}
            >
              Відстежуються
            </li>
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
