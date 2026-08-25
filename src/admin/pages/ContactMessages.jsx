import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import SectionHeader from '../../components/common/SectionHeader.jsx';
import GlassCard from '../../components/common/GlassCard.jsx';
import Button from '../../components/common/Button.jsx';
import Loading from '../../components/common/Loading.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import { getAdminContactMessages, updateAdminContactMessage } from '../../api/adminApi.js';

export default function ContactMessagesPage() {
  const queryClient = useQueryClient();
  const messagesQuery = useQuery({ queryKey: ['admin-contact-messages'], queryFn: getAdminContactMessages });
  const updateMutation = useMutation({
    mutationFn: updateAdminContactMessage,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-contact-messages'] }),
  });

  if (messagesQuery.isLoading) return <Loading label="Loading messages" />;
  if (messagesQuery.isError) return <ErrorState title="Messages unavailable" />;

  return (
    <div className="page-stack">
      <SectionHeader badge="Messages" title="Contact submissions" description="Review and update contact message status." align="left" />
      <GlassCard className="service-card">
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Email</th><th>Status</th><th /></tr></thead>
          <tbody>
            {messagesQuery.data?.map((message) => (
              <tr key={message.id}>
                <td>{message.name}</td>
                <td>{message.email}</td>
                <td>{message.status}</td>
                <td>
                  <div className="admin-table-actions">
                    <Button type="button" variant="secondary" onClick={() => updateMutation.mutate({ id: message.id, payload: { status: 'read' } })}>Mark read</Button>
                    <Button type="button" variant="secondary" onClick={() => updateMutation.mutate({ id: message.id, payload: { status: 'archived' } })}>Archive</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}
