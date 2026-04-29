import ChatPanel from './ChatPanel';

const ChatWidget = ({ isOpen, onClose }) => {
  return <ChatPanel isOpen={isOpen} onClose={onClose} />;
};

export default ChatWidget;
