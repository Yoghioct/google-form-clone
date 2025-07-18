import React from 'react';
import { UserList } from '../../features/user/UserList';

const UserPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-[var(--navigation-height)]">
      <UserList />
    </div>
  );
};

export default UserPage; 