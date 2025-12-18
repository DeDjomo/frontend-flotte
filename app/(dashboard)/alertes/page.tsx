// src/app/(dashboard)/alertes/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { notificationService } from '@/app/lib/services';
import { useAuth } from '@/app/contexts/AuthContext';
import { useModal } from '@/app/contexts/ModalContext';
import styles from './alertes.module.css';
import { FiBell, FiBellOff, FiCheck, FiAlertCircle, FiInfo, FiTrash2 } from 'react-icons/fi';

interface Notification {
  notificationId: number;
  notificationSubject: string;
  notificationContent: string;
  notificationDateTime: string;
  notificationState: boolean;
  userId: number;
}

export default function AlertesPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [markingAsRead, setMarkingAsRead] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { showConfirm } = useModal();

  useEffect(() => {
    if (user?.userId) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user?.userId) return;

    try {
      setLoading(true);
      setError(null);

      console.log('📡 Récupération des notifications...');
      const data = await notificationService.getNotificationsByUser(user.userId);
      console.log('✅ Notifications récupérées:', data.length);

      const sorted = data.sort((a: Notification, b: Notification) => {
        return new Date(b.notificationDateTime).getTime() - new Date(a.notificationDateTime).getTime();
      });

      setNotifications(sorted);
    } catch (err) {
      console.error('❌ Erreur lors du chargement des notifications:', err);
      setError('Impossible de charger les notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: number, e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      setMarkingAsRead(notificationId);
      console.log('📝 Marquage comme lu:', notificationId);

      await notificationService.markAsRead(notificationId);

      setNotifications(prev =>
        prev.map(notif =>
          notif.notificationId === notificationId
            ? { ...notif, notificationState: true }
            : notif
        )
      );

      console.log('✅ Notification marquée comme lue');
    } catch (err) {
      console.error('❌ Erreur lors du marquage:', err);
      alert('Impossible de marquer la notification comme lue');
    } finally {
      setMarkingAsRead(null);
    }
  };

  const handleDelete = async (notificationId: number) => {
    if (!await showConfirm({
      title: 'Supprimer la notification',
      message: 'Êtes-vous sûr de vouloir supprimer cette notification ?',
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      isDanger: true
    })) {
      return;
    }

    try {
      setDeletingId(notificationId);
      await notificationService.deleteNotification(notificationId);

      setNotifications(prev => prev.filter(n => n.notificationId !== notificationId));
      console.log('✅ Notification supprimée');
    } catch (err) {
      console.error('❌ Erreur suppression:', err);
      alert('Erreur lors de la suppression');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (err) {
      return '-';
    }
  };

  const getTimeAgo = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "À l'instant";
      if (diffMins < 60) return `Il y a ${diffMins} min`;
      if (diffHours < 24) return `Il y a ${diffHours}h`;
      if (diffDays < 7) return `Il y a ${diffDays}j`;
      return formatDateTime(dateString);
    } catch (err) {
      return '';
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Notifications</h1>
        </div>
        <div className={styles.loading}>Chargement des notifications...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Notifications</h1>
        </div>
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={fetchNotifications} className={styles.retryButton}>
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const unreadNotifications = notifications.filter(n => !n.notificationState);
  const readNotifications = notifications.filter(n => n.notificationState);

  const filteredNotifications =
    filter === 'unread' ? unreadNotifications :
      filter === 'read' ? readNotifications :
        notifications;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Notifications</h1>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{unreadNotifications.length}</span>
            <span className={styles.statLabel}>Non lues</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{notifications.length}</span>
            <span className={styles.statLabel}>Total</span>
          </div>
        </div>
      </div>

      <div className={styles.filters}>
        <button
          className={`${styles.filterButton} ${filter === 'all' ? styles.filterActive : ''}`}
          onClick={() => setFilter('all')}
        >
          <FiBell /> Toutes ({notifications.length})
        </button>
        <button
          className={`${styles.filterButton} ${filter === 'unread' ? styles.filterActive : ''}`}
          onClick={() => setFilter('unread')}
        >
          <FiAlertCircle /> Non lues ({unreadNotifications.length})
        </button>
        <button
          className={`${styles.filterButton} ${filter === 'read' ? styles.filterActive : ''}`}
          onClick={() => setFilter('read')}
        >
          <FiCheck /> Lues ({readNotifications.length})
        </button>
      </div>

      {filteredNotifications.length === 0 ? (
        <div className={styles.emptyState}>
          <FiBellOff className={styles.emptyIcon} />
          <h2 className={styles.emptyTitle}>
            {filter === 'unread' ? 'Aucune notification non lue' :
              filter === 'read' ? 'Aucune notification lue' :
                'Aucune notification'}
          </h2>
          <p className={styles.emptyText}>
            {filter === 'unread' ? 'Toutes vos notifications ont été lues' :
              filter === 'read' ? 'Vous navez pas encore lu de notifications' :
                'Vous navez reçu aucune notification'}
          </p>
        </div>
      ) : (
        <div className={styles.notificationsList}>
          {filteredNotifications.map((notification) => (
            <div
              key={notification.notificationId}
              className={`${styles.notificationCard} ${!notification.notificationState ? styles.unread : ''
                }`}
            >
              <div className={styles.notificationIcon}>
                {!notification.notificationState ? (
                  <FiAlertCircle className={styles.iconUnread} />
                ) : (
                  <FiInfo className={styles.iconRead} />
                )}
              </div>

              <div className={styles.notificationContent}>
                <div className={styles.notificationHeader}>
                  <h3 className={styles.notificationSubject}>
                    {notification.notificationSubject}
                    {!notification.notificationState && (
                      <span className={styles.newBadge}>Nouveau</span>
                    )}
                  </h3>
                  <span className={styles.notificationTime}>
                    {getTimeAgo(notification.notificationDateTime)}
                  </span>
                </div>

                <p className={styles.notificationMessage}>
                  {notification.notificationContent}
                </p>

                <div className={styles.notificationFooter}>
                  <span className={styles.notificationDate}>
                    {formatDateTime(notification.notificationDateTime)}
                  </span>
                  {!notification.notificationState && (
                    <button
                      className={styles.markAsReadButton}
                      onClick={(e) => handleMarkAsRead(notification.notificationId, e)}
                      disabled={markingAsRead === notification.notificationId}
                    >
                      <FiCheck />
                      {markingAsRead === notification.notificationId
                        ? 'Marquage...'
                        : 'Marquer comme lu'}
                    </button>
                  )}
                  <button
                    className={styles.deleteButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(notification.notificationId);
                    }}
                    disabled={deletingId === notification.notificationId}
                    title="Supprimer la notification"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}