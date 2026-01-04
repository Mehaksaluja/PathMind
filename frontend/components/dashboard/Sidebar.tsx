'use client'

import styles from './Sidebar.module.css'

interface SidebarProps {
  selectedTopic: string | null
}

export default function Sidebar({ selectedTopic }: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h2>AI Assistant</h2>
      </div>
      
      <div className={styles.sidebarContent}>
        {selectedTopic ? (
          <div className={styles.topicInfo}>
            <h3>Selected Topic</h3>
            <p>Topic ID: {selectedTopic}</p>
            <p className={styles.placeholder}>
              AI explanation will appear here when you click on a topic.
            </p>
          </div>
        ) : (
          <div className={styles.placeholder}>
            <p>Click on any topic in the roadmap to get AI-powered explanations.</p>
          </div>
        )}
      </div>
    </aside>
  )
}

