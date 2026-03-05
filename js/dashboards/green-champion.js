// Green Champion Dashboard
class GreenChampionDashboard {
  constructor() {
    this.currentSection = 'dashboard';
  }

  loadSection(section) {
    this.currentSection = section;
    const content = document.getElementById('mainContent');
    
    switch (section) {
      case 'dashboard':
        content.innerHTML = this.renderDashboard();
        break;
      case 'my-reports':
        content.innerHTML = this.renderMyReports();
        break;
      case 'community':
        content.innerHTML = this.renderCommunity();
        break;
      case 'rewards':
        content.innerHTML = this.renderRewards();
        break;
      case 'heat-map':
        content.innerHTML = this.renderHeatMap();
        break;
      case 'training':
        content.innerHTML = this.renderTraining();
        break;
      case 'profile':
        content.innerHTML = this.renderProfile();
        break;
      default:
        content.innerHTML = this.renderDashboard();
    }

    this.bindEvents();
  }

  renderDashboard() {
    const user = authSystem.getCurrentUser();
    const trainingStats = window.TrainingSystem.getTrainingStats(user.id);
    
    return `
      <div class="dashboard-header">
        <h1 class="dashboard-title">Green Champion Dashboard</h1>
        <p class="dashboard-subtitle">Welcome back, ${user.name}! Lead your community towards sustainability</p>
      </div>

      <div class="dashboard-stats">
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">Community Impact</span>
            <div class="stat-icon success">
              <i class="fas fa-users"></i>
            </div>
          </div>
          <div class="stat-value">156</div>
          <div class="stat-change positive">
            <i class="fas fa-arrow-up"></i>
            Citizens engaged
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">Reports Submitted</span>
            <div class="stat-icon primary">
              <i class="fas fa-flag"></i>
            </div>
          </div>
          <div class="stat-value">23</div>
          <div class="stat-change positive">
            <i class="fas fa-check"></i>
            21 resolved
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">Leadership Level</span>
            <div class="stat-icon warning">
              <i class="fas fa-star"></i>
            </div>
          </div>
          <div class="stat-value">${trainingStats.level}</div>
          <div class="stat-change positive">
            <i class="fas fa-graduation-cap"></i>
            ${trainingStats.xp} XP
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">Reward Points</span>
            <div class="stat-icon secondary">
              <i class="fas fa-gift"></i>
            </div>
          </div>
          <div class="stat-value">2,450</div>
          <div class="stat-change positive">
            <i class="fas fa-coins"></i>
            Available to redeem
          </div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; margin-top: 2rem;">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Recent Community Activities</h3>
            <button class="btn btn-primary" onclick="navigation.navigateTo('community')">
              <i class="fas fa-eye"></i>
              View All Activities
            </button>
          </div>
          <div class="card-body">
            ${this.renderRecentActivities()}
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Quick Actions</h3>
          </div>
          <div class="card-body">
            <div style="display: flex; flex-direction: column; gap: 1rem;">
              <button class="btn btn-primary" onclick="window.GreenChampionDashboard.createCommunityEvent()">
                <i class="fas fa-calendar-plus"></i>
                Create Event
              </button>
              <button class="btn btn-secondary" onclick="navigation.navigateTo('my-reports')">
                <i class="fas fa-flag"></i>
                Submit Report
              </button>
              <button class="btn btn-success" onclick="navigation.navigateTo('training')">
                <i class="fas fa-graduation-cap"></i>
                Leadership Training
              </button>
              <button class="btn btn-info" onclick="navigation.navigateTo('heat-map')">
                <i class="fas fa-map"></i>
                View Heat Map
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Community Environmental Impact</h3>
          </div>
          <div class="card-body">
            <div class="impact-metrics" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem;">
              <div class="impact-item" style="text-align: center; padding: 2rem; background: var(--gray-50); border-radius: 12px;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🌱</div>
                <div style="font-size: 2rem; font-weight: 700; color: var(--success); margin-bottom: 0.5rem;">245kg</div>
                <div style="color: var(--gray-600); margin-bottom: 0.25rem;">CO₂ Reduced</div>
                <div style="font-size: 0.875rem; color: var(--gray-500);">Through your initiatives</div>
              </div>
              
              <div class="impact-item" style="text-align: center; padding: 2rem; background: var(--gray-50); border-radius: 12px;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">♻️</div>
                <div style="font-size: 2rem; font-weight: 700; color: var(--primary); margin-bottom: 0.5rem;">1.2T</div>
                <div style="color: var(--gray-600); margin-bottom: 0.25rem;">Waste Diverted</div>
                <div style="font-size: 0.875rem; color: var(--gray-500);">From landfills</div>
              </div>
              
              <div class="impact-item" style="text-align: center; padding: 2rem; background: var(--gray-50); border-radius: 12px;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">👥</div>
                <div style="font-size: 2rem; font-weight: 700; color: var(--warning); margin-bottom: 0.5rem;">156</div>
                <div style="color: var(--gray-600); margin-bottom: 0.25rem;">Citizens Engaged</div>
                <div style="font-size: 0.875rem; color: var(--gray-500);">In your programs</div>
              </div>
              
              <div class="impact-item" style="text-align: center; padding: 2rem; background: var(--gray-50); border-radius: 12px;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🏆</div>
                <div style="font-size: 2rem; font-weight: 700; color: var(--secondary); margin-bottom: 0.5rem;">#2</div>
                <div style="color: var(--gray-600); margin-bottom: 0.25rem;">Champion Ranking</div>
                <div style="font-size: 0.875rem; color: var(--gray-500);">In your district</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderRecentActivities() {
    const activities = [
      { type: 'event', title: 'Community Cleanup Drive', participants: 45, date: '2 days ago', status: 'completed' },
      { type: 'report', title: 'Illegal Dumping Report', location: 'Park Avenue', date: '3 days ago', status: 'resolved' },
      { type: 'training', title: 'Waste Segregation Workshop', participants: 28, date: '1 week ago', status: 'completed' }
    ];

    return `
      <div class="activities-list">
        ${activities.map(activity => `
          <div class="activity-item" style="display: flex; align-items: center; gap: 1rem; padding: 1rem 0; border-bottom: 1px solid var(--gray-200);">
            <div style="width: 40px; height: 40px; border-radius: 50%; background: ${activity.type === 'event' ? 'var(--primary)' : activity.type === 'report' ? 'var(--warning)' : 'var(--success)'}; display: flex; align-items: center; justify-content: center; color: white;">
              <i class="fas fa-${activity.type === 'event' ? 'calendar' : activity.type === 'report' ? 'flag' : 'graduation-cap'}"></i>
            </div>
            <div style="flex: 1;">
              <div style="font-weight: 600; margin-bottom: 0.25rem;">${activity.title}</div>
              <div style="font-size: 0.875rem; color: var(--gray-600);">
                ${activity.participants ? `${activity.participants} participants` : activity.location}
                • ${activity.date}
              </div>
            </div>
            <span class="badge badge-${activity.status === 'completed' ? 'success' : activity.status === 'resolved' ? 'success' : 'info'}">
              ${Utils.capitalize(activity.status)}
            </span>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderMyReports() {
    return `
      <div class="dashboard-header">
        <h1 class="dashboard-title">My Environmental Reports</h1>
        <p class="dashboard-subtitle">Track and manage your environmental impact reports</p>
        <button class="btn btn-primary" onclick="window.GreenChampionDashboard.submitNewReport()">
          <i class="fas fa-plus"></i>
          Submit New Report
        </button>
      </div>

      <div class="dashboard-stats" style="margin-bottom: 2rem;">
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">Total Reports</span>
            <div class="stat-icon primary">
              <i class="fas fa-flag"></i>
            </div>
          </div>
          <div class="stat-value">23</div>
          <div class="stat-change positive">
            <i class="fas fa-arrow-up"></i>
            This month: 5
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">Resolved</span>
            <div class="stat-icon success">
              <i class="fas fa-check-circle"></i>
            </div>
          </div>
          <div class="stat-value">21</div>
          <div class="stat-change positive">
            <i class="fas fa-percentage"></i>
            91% success rate
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">Impact Points</span>
            <div class="stat-icon warning">
              <i class="fas fa-star"></i>
            </div>
          </div>
          <div class="stat-value">1,250</div>
          <div class="stat-change positive">
            <i class="fas fa-coins"></i>
            Earned from reports
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Report History</h3>
          <div style="display: flex; gap: 1rem;">
            <select class="form-control" style="width: auto;">
              <option>All Categories</option>
              <option>Waste Management</option>
              <option>Illegal Dumping</option>
              <option>Environmental Hazard</option>
              <option>Community Initiative</option>
            </select>
            <select class="form-control" style="width: auto;">
              <option>All Status</option>
              <option>Pending</option>
              <option>Under Review</option>
              <option>Resolved</option>
            </select>
          </div>
        </div>
        <div class="card-body">
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Report ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Impact Points</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${this.generateReportRows()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  generateReportRows() {
    const reports = [
      { id: 'GC001', title: 'Community Recycling Initiative', category: 'Community Initiative', location: 'Green Valley', status: 'resolved', points: 150, date: '2024-01-15' },
      { id: 'GC002', title: 'Illegal Dumping Site', category: 'Illegal Dumping', location: 'Industrial Area', status: 'resolved', points: 100, date: '2024-01-14' },
      { id: 'GC003', title: 'Broken Waste Containers', category: 'Waste Management', location: 'Main Street', status: 'under_review', points: 0, date: '2024-01-13' },
      { id: 'GC004', title: 'Chemical Spill Report', category: 'Environmental Hazard', location: 'Factory District', status: 'resolved', points: 200, date: '2024-01-12' }
    ];

    return reports.map(report => `
      <tr>
        <td>${report.id}</td>
        <td>${report.title}</td>
        <td><span class="badge badge-info">${report.category}</span></td>
        <td>${report.location}</td>
        <td>${Utils.getStatusBadge(report.status)}</td>
        <td>
          ${report.points > 0 ? `
            <div style="display: flex; align-items: center; gap: 0.25rem; color: var(--warning);">
              <i class="fas fa-star"></i>
              <span style="font-weight: 600;">${report.points}</span>
            </div>
          ` : '-'}
        </td>
        <td>${report.date}</td>
        <td>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-ghost" onclick="window.GreenChampionDashboard.viewReport('${report.id}')" title="View">
              <i class="fas fa-eye"></i>
            </button>
            ${report.status === 'pending' ? `
              <button class="btn btn-ghost" onclick="window.GreenChampionDashboard.editReport('${report.id}')" title="Edit">
                <i class="fas fa-edit"></i>
              </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `).join('');
  }

  renderCommunity() {
    return `
      <div class="dashboard-header">
        <h1 class="dashboard-title">Community Engagement</h1>
        <p class="dashboard-subtitle">Connect with citizens and organize environmental initiatives</p>
        <button class="btn btn-primary" onclick="window.GreenChampionDashboard.createCommunityEvent()">
          <i class="fas fa-plus"></i>
          Create New Event
        </button>
      </div>

      <div class="dashboard-stats" style="margin-bottom: 2rem;">
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">Active Members</span>
            <div class="stat-icon primary">
              <i class="fas fa-users"></i>
            </div>
          </div>
          <div class="stat-value">156</div>
          <div class="stat-change positive">
            <i class="fas fa-arrow-up"></i>
            +12 this week
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">Events Organized</span>
            <div class="stat-icon success">
              <i class="fas fa-calendar"></i>
            </div>
          </div>
          <div class="stat-value">8</div>
          <div class="stat-change positive">
            <i class="fas fa-check"></i>
            This month
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">Participation Rate</span>
            <div class="stat-icon warning">
              <i class="fas fa-percentage"></i>
            </div>
          </div>
          <div class="stat-value">78%</div>
          <div class="stat-change positive">
            <i class="fas fa-arrow-up"></i>
            Excellent engagement
          </div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Upcoming Events</h3>
          </div>
          <div class="card-body">
            ${this.renderUpcomingEvents()}
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Community Leaderboard</h3>
          </div>
          <div class="card-body">
            ${this.renderCommunityLeaderboard()}
          </div>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Event History</h3>
          </div>
          <div class="card-body">
            <div class="table-container">
              <table class="table">
                <thead>
                  <tr>
                    <th>Event Name</th>
                    <th>Date</th>
                    <th>Participants</th>
                    <th>Impact</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${this.generateEventRows()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderUpcomingEvents() {
    const events = [
      { name: 'Beach Cleanup Drive', date: '2024-01-20', time: '9:00 AM', participants: 25, location: 'City Beach' },
      { name: 'Recycling Workshop', date: '2024-01-22', time: '2:00 PM', participants: 15, location: 'Community Center' },
      { name: 'Tree Planting Event', date: '2024-01-25', time: '8:00 AM', participants: 40, location: 'Central Park' }
    ];

    return events.map(event => `
      <div class="event-card" style="border: 1px solid var(--gray-200); border-radius: 8px; padding: 1rem; margin-bottom: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
          <h4 style="margin: 0; color: var(--gray-900);">${event.name}</h4>
          <span class="badge badge-info">Upcoming</span>
        </div>
        <div style="font-size: 0.875rem; color: var(--gray-600); margin-bottom: 0.5rem;">
          <i class="fas fa-calendar"></i> ${event.date} at ${event.time}
        </div>
        <div style="font-size: 0.875rem; color: var(--gray-600); margin-bottom: 0.5rem;">
          <i class="fas fa-map-marker-alt"></i> ${event.location}
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="font-size: 0.875rem; color: var(--gray-600);">
            <i class="fas fa-users"></i> ${event.participants} registered
          </div>
          <button class="btn btn-ghost" onclick="window.GreenChampionDashboard.manageEvent('${event.name}')">
            <i class="fas fa-cog"></i>
            Manage
          </button>
        </div>
      </div>
    `).join('');
  }

  renderCommunityLeaderboard() {
    const leaders = [
      { name: 'Sarah Johnson', points: 2850, rank: 1, badge: '🥇' },
      { name: 'You', points: 2450, rank: 2, badge: '🥈' },
      { name: 'Mike Chen', points: 2200, rank: 3, badge: '🥉' },
      { name: 'Lisa Rodriguez', points: 1950, rank: 4, badge: '🏅' },
      { name: 'David Kim', points: 1800, rank: 5, badge: '🏅' }
    ];

    return leaders.map(leader => `
      <div class="leader-item" style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid var(--gray-200);">
        <div style="font-size: 1.5rem;">${leader.badge}</div>
        <div style="flex: 1;">
          <div style="font-weight: 600; color: ${leader.name === 'You' ? 'var(--primary)' : 'var(--gray-900)'};">
            ${leader.name}
            ${leader.name === 'You' ? ' 👤' : ''}
          </div>
          <div style="font-size: 0.875rem; color: var(--gray-600);">Rank #${leader.rank}</div>
        </div>
        <div style="text-align: right;">
          <div style="font-weight: 600; color: var(--warning);">${leader.points}</div>
          <div style="font-size: 0.75rem; color: var(--gray-500);">points</div>
        </div>
      </div>
    `).join('');
  }

  generateEventRows() {
    const events = [
      { name: 'Community Cleanup Drive', date: '2024-01-15', participants: 45, impact: '2.5T waste collected', status: 'completed' },
      { name: 'Recycling Workshop', date: '2024-01-10', participants: 28, impact: '85% knowledge increase', status: 'completed' },
      { name: 'Awareness Campaign', date: '2024-01-08', participants: 120, impact: '500 flyers distributed', status: 'completed' },
      { name: 'School Visit Program', date: '2024-01-05', participants: 60, impact: '3 schools covered', status: 'completed' }
    ];

    return events.map(event => `
      <tr>
        <td>${event.name}</td>
        <td>${event.date}</td>
        <td>${event.participants}</td>
        <td>${event.impact}</td>
        <td><span class="badge badge-success">${Utils.capitalize(event.status)}</span></td>
        <td>
          <button class="btn btn-ghost" onclick="window.GreenChampionDashboard.viewEventReport('${event.name}')" title="View Report">
            <i class="fas fa-eye"></i>
          </button>
        </td>
      </tr>
    `).join('');
  }

  renderRewards() {
    return `
      <div class="dashboard-header">
        <h1 class="dashboard-title">Rewards & Recognition</h1>
        <p class="dashboard-subtitle">Redeem your impact points and showcase your achievements</p>
      </div>

      <div class="dashboard-stats" style="margin-bottom: 2rem;">
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">Available Points</span>
            <div class="stat-icon warning">
              <i class="fas fa-coins"></i>
            </div>
          </div>
          <div class="stat-value">2,450</div>
          <div class="stat-change positive">
            <i class="fas fa-arrow-up"></i>
            Ready to redeem
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">Achievements</span>
            <div class="stat-icon success">
              <i class="fas fa-trophy"></i>
            </div>
          </div>
          <div class="stat-value">12</div>
          <div class="stat-change positive">
            <i class="fas fa-medal"></i>
            Badges earned
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">Community Rank</span>
            <div class="stat-icon primary">
              <i class="fas fa-ranking-star"></i>
            </div>
          </div>
          <div class="stat-value">#2</div>
          <div class="stat-change positive">
            <i class="fas fa-arrow-up"></i>
            In district
          </div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Available Rewards</h3>
          </div>
          <div class="card-body">
            <div class="rewards-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
              ${this.renderRewardItems()}
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">My Achievements</h3>
          </div>
          <div class="card-body">
            ${this.renderAchievements()}
          </div>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Recognition Wall</h3>
          </div>
          <div class="card-body">
            <div class="recognition-items" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
              ${this.renderRecognitionItems()}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderRewardItems() {
    const rewards = [
      { name: 'Eco-Friendly Water Bottle', points: 500, image: '🍶', description: 'Stainless steel water bottle' },
      { name: 'Green Champion Certificate', points: 1000, image: '🏆', description: 'Official recognition certificate' },
      { name: 'Tree Planting Kit', points: 750, image: '🌱', description: 'Complete tree planting set' },
      { name: 'Organic Compost Bin', points: 1200, image: '🗂️', description: 'Premium composting system' }
    ];

    return rewards.map(reward => `
      <div class="reward-card" style="border: 1px solid var(--gray-200); border-radius: 12px; padding: 1.5rem; text-align: center; background: var(--white);">
        <div style="font-size: 3rem; margin-bottom: 1rem;">${reward.image}</div>
        <h4 style="margin-bottom: 0.5rem; color: var(--gray-900);">${reward.name}</h4>
        <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">${reward.description}</p>
        <div style="font-size: 1.25rem; font-weight: 700; color: var(--warning); margin-bottom: 1rem;">
          ${reward.points} points
        </div>
        <button class="btn ${reward.points <= 2450 ? 'btn-primary' : 'btn-ghost'}" 
                ${reward.points <= 2450 ? `onclick="window.GreenChampionDashboard.redeemReward('${reward.name}', ${reward.points})"` : 'disabled'}>
          <i class="fas fa-${reward.points <= 2450 ? 'gift' : 'lock'}"></i>
          ${reward.points <= 2450 ? 'Redeem' : 'Need More Points'}
        </button>
      </div>
    `).join('');
  }

  renderAchievements() {
    const achievements = [
      { name: 'Community Leader', icon: '👑', description: 'Led 5+ community events', earned: true },
      { name: 'Environmental Hero', icon: '🌍', description: 'Prevented 100kg+ CO₂', earned: true },
      { name: 'Waste Warrior', icon: '♻️', description: 'Diverted 1T+ waste', earned: true },
      { name: 'Green Mentor', icon: '🎓', description: 'Trained 50+ citizens', earned: false },
      { name: 'Eco Champion', icon: '🏆', description: 'Top 3 in district', earned: true }
    ];

    return achievements.map(achievement => `
      <div class="achievement-item" style="display: flex; align-items: center; gap: 1rem; padding: 1rem 0; border-bottom: 1px solid var(--gray-200); ${achievement.earned ? '' : 'opacity: 0.5;'}">
        <div style="font-size: 2rem;">${achievement.icon}</div>
        <div style="flex: 1;">
          <div style="font-weight: 600; margin-bottom: 0.25rem; color: ${achievement.earned ? 'var(--gray-900)' : 'var(--gray-500)'};">
            ${achievement.name}
          </div>
          <div style="font-size: 0.875rem; color: var(--gray-600);">${achievement.description}</div>
        </div>
        ${achievement.earned ? `
          <i class="fas fa-check-circle" style="color: var(--success); font-size: 1.25rem;"></i>
        ` : `
          <i class="fas fa-lock" style="color: var(--gray-400); font-size: 1.25rem;"></i>
        `}
      </div>
    `).join('');
  }

  renderRecognitionItems() {
    const recognitions = [
      { title: 'Featured in City Newsletter', date: '2024-01-10', description: 'Recognized for outstanding community leadership in environmental initiatives' },
      { title: 'Mayor\'s Environmental Award', date: '2024-01-05', description: 'Received special recognition from the Mayor for exceptional contribution to city cleanliness' },
      { title: 'Media Interview', date: '2023-12-28', description: 'Featured in local TV interview discussing community waste management success stories' }
    ];

    return recognitions.map(recognition => `
      <div class="recognition-card" style="border: 1px solid var(--gray-200); border-radius: 12px; padding: 1.5rem; background: var(--white);">
        <div style="display: flex; align-items: start; gap: 1rem;">
          <div style="font-size: 2rem; color: var(--warning);">🏅</div>
          <div style="flex: 1;">
            <h4 style="margin-bottom: 0.5rem; color: var(--gray-900);">${recognition.title}</h4>
            <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 0.5rem;">${recognition.description}</p>
            <div style="font-size: 0.75rem; color: var(--gray-500);">${recognition.date}</div>
          </div>
        </div>
      </div>
    `).join('');
  }

  renderHeatMap() {
    return `
      <div class="dashboard-header">
        <h1 class="dashboard-title">Environmental Heat Map</h1>
        <p class="dashboard-subtitle">Visualize environmental issues and impact across your community</p>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Community Environmental Status</h3>
          <div style="display: flex; gap: 1rem;">
            <select class="form-control" style="width: auto;">
              <option>All Issues</option>
              <option>Waste Management</option>
              <option>Air Quality</option>
              <option>Water Quality</option>
              <option>Noise Pollution</option>
            </select>
            <select class="form-control" style="width: auto;">
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
              <option>Last 3 Months</option>
              <option>Last Year</option>
            </select>
            <button class="btn btn-secondary" onclick="window.GreenChampionDashboard.refreshHeatMap()">
              <i class="fas fa-sync"></i>
              Refresh
            </button>
          </div>
        </div>
        <div class="card-body">
          <div class="map-container" style="height: 500px; position: relative;">
            <div class="heat-map"></div>
            <div class="map-placeholder">
              <i class="fas fa-map" style="font-size: 4rem; color: var(--gray-400); margin-bottom: 1rem;"></i>
              <h3 style="margin-bottom: 1rem;">Environmental Heat Map</h3>
              <p style="color: var(--gray-600); margin-bottom: 2rem;">
                Interactive map showing environmental issue density and resolution status
              </p>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem; max-width: 600px; margin: 0 auto;">
                <div style="text-align: center;">
                  <div style="width: 20px; height: 20px; background: var(--error); border-radius: 50%; margin: 0 auto 0.5rem;"></div>
                  <div style="font-size: 0.875rem; color: var(--gray-600);">High Priority</div>
                </div>
                <div style="text-align: center;">
                  <div style="width: 20px; height: 20px; background: var(--warning); border-radius: 50%; margin: 0 auto 0.5rem;"></div>
                  <div style="font-size: 0.875rem; color: var(--gray-600);">Medium Priority</div>
                </div>
                <div style="text-align: center;">
                  <div style="width: 20px; height: 20px; background: var(--primary); border-radius: 50%; margin: 0 auto 0.5rem;"></div>
                  <div style="font-size: 0.875rem; color: var(--gray-600);">Low Priority</div>
                </div>
                <div style="text-align: center;">
                  <div style="width: 20px; height: 20px; background: var(--success); border-radius: 50%; margin: 0 auto 0.5rem;"></div>
                  <div style="font-size: 0.875rem; color: var(--gray-600);">Resolved</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style="margin-top: 2rem; display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Issue Statistics</h3>
          </div>
          <div class="card-body">
            <div class="stats-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
              <div style="text-align: center; padding: 1rem; background: var(--gray-50); border-radius: 8px;">
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--error);">23</div>
                <div style="font-size: 0.875rem; color: var(--gray-600);">High Priority</div>
              </div>
              <div style="text-align: center; padding: 1rem; background: var(--gray-50); border-radius: 8px;">
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--warning);">45</div>
                <div style="font-size: 0.875rem; color: var(--gray-600);">Medium Priority</div>
              </div>
              <div style="text-align: center; padding: 1rem; background: var(--gray-50); border-radius: 8px;">
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">67</div>
                <div style="font-size: 0.875rem; color: var(--gray-600);">Low Priority</div>
              </div>
              <div style="text-align: center; padding: 1rem; background: var(--gray-50); border-radius: 8px;">
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--success);">189</div>
                <div style="font-size: 0.875rem; color: var(--gray-600);">Resolved</div>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Recent Hotspots</h3>
          </div>
          <div class="card-body">
            ${this.renderHotspots()}
          </div>
        </div>
      </div>
    `;
  }

  renderHotspots() {
    const hotspots = [
      { location: 'Industrial District', issues: 12, severity: 'high', trend: 'increasing' },
      { location: 'Market Area', issues: 8, severity: 'medium', trend: 'stable' },
      { location: 'Residential Zone A', issues: 5, severity: 'low', trend: 'decreasing' },
      { location: 'School District', issues: 3, severity: 'low', trend: 'stable' }
    ];

    return hotspots.map(hotspot => `
      <div class="hotspot-item" style="display: flex; align-items: center; gap: 1rem; padding: 1rem 0; border-bottom: 1px solid var(--gray-200);">
        <div style="width: 12px; height: 12px; border-radius: 50%; background: ${hotspot.severity === 'high' ? 'var(--error)' : hotspot.severity === 'medium' ? 'var(--warning)' : 'var(--primary)'};"></div>
        <div style="flex: 1;">
          <div style="font-weight: 600; margin-bottom: 0.25rem;">${hotspot.location}</div>
          <div style="font-size: 0.875rem; color: var(--gray-600);">${hotspot.issues} active issues</div>
        </div>
        <div style="text-align: right;">
          <i class="fas fa-arrow-${hotspot.trend === 'increasing' ? 'up' : hotspot.trend === 'decreasing' ? 'down' : 'right'}" 
             style="color: ${hotspot.trend === 'increasing' ? 'var(--error)' : hotspot.trend === 'decreasing' ? 'var(--success)' : 'var(--gray-400)'};"></i>
        </div>
      </div>
    `).join('');
  }

  renderTraining() {
    const user = authSystem.getCurrentUser();
    const trainingStats = window.TrainingSystem.getTrainingStats(user.id);
    const modules = ENHANCED_TRAINING_MODULES['green-champion'] || [];

    return `
      <div class="dashboard-header">
        <h1 class="dashboard-title">Leadership Training</h1>
        <p class="dashboard-subtitle">Develop advanced leadership skills for environmental advocacy</p>
      </div>

      <div class="dashboard-stats" style="margin-bottom: 2rem;">
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">XP Points</span>
            <div class="stat-icon warning">
              <i class="fas fa-star"></i>
            </div>
          </div>
          <div class="stat-value">${trainingStats.xp}</div>
          <div class="stat-change positive">
            <i class="fas fa-arrow-up"></i>
            Level ${trainingStats.level}
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">Progress</span>
            <div class="stat-icon primary">
              <i class="fas fa-graduation-cap"></i>
            </div>
          </div>
          <div class="stat-value">${trainingStats.completionPercentage}%</div>
          <div class="stat-change positive">
            <i class="fas fa-check"></i>
            ${trainingStats.completedModules}/${trainingStats.totalModules} modules
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">Leadership Score</span>
            <div class="stat-icon success">
              <i class="fas fa-crown"></i>
            </div>
          </div>
          <div class="stat-value">92%</div>
          <div class="stat-change positive">
            <i class="fas fa-arrow-up"></i>
            Excellent
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">Mentees</span>
            <div class="stat-icon secondary">
              <i class="fas fa-users"></i>
            </div>
          </div>
          <div class="stat-value">28</div>
          <div class="stat-change positive">
            <i class="fas fa-arrow-up"></i>
            Citizens trained
          </div>
        </div>
      </div>

      <div class="training-modules">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Leadership Training Modules</h3>
            <div style="display: flex; gap: 1rem;">
              <button class="btn btn-secondary" onclick="window.GreenChampionDashboard.showCertificates()">
                <i class="fas fa-certificate"></i>
                My Certificates
              </button>
              <button class="btn btn-info" onclick="window.GreenChampionDashboard.showMentorshipProgram()">
                <i class="fas fa-chalkboard-teacher"></i>
                Mentorship Program
              </button>
            </div>
          </div>
          <div class="card-body">
            <div class="modules-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2rem;">
              ${modules.map(module => {
                const isCompleted = window.TrainingSystem.isModuleCompleted(module.id, user.id);
                return `
                  <div class="module-card" style="border: 2px solid ${isCompleted ? 'var(--success)' : 'var(--gray-200)'}; border-radius: 16px; padding: 2rem; background: var(--white); position: relative; transition: all 0.3s ease;">
                    ${isCompleted ? `
                      <div style="position: absolute; top: 1rem; right: 1rem; background: var(--success); color: white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-check"></i>
                      </div>
                    ` : ''}
                    
                    <div class="module-header" style="text-align: center; margin-bottom: 2rem;">
                      <div style="font-size: 4rem; margin-bottom: 1rem;">${module.icon}</div>
                      <h4 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--gray-900);">${module.title}</h4>
                      <p style="color: var(--gray-600); margin-bottom: 1rem;">${module.description}</p>
                    </div>

                    <div class="module-stats" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem;">
                      <div style="text-align: center;">
                        <div style="font-size: 1.2rem; font-weight: 700; color: var(--primary);">${module.exercises.length}</div>
                        <div style="font-size: 0.75rem; color: var(--gray-600);">Exercises</div>
                      </div>
                      <div style="text-align: center;">
                        <div style="font-size: 1.2rem; font-weight: 700; color: var(--warning);">${module.points}</div>
                        <div style="font-size: 0.75rem; color: var(--gray-600);">XP Points</div>
                      </div>
                      <div style="text-align: center;">
                        <div style="font-size: 1.2rem; font-weight: 700; color: var(--secondary);">${module.duration}</div>
                        <div style="font-size: 0.75rem; color: var(--gray-600);">Duration</div>
                      </div>
                    </div>

                    <div class="module-objectives" style="margin-bottom: 2rem;">
                      <h5 style="margin-bottom: 1rem; color: var(--gray-800);">Learning Objectives:</h5>
                      <ul style="list-style: none; padding: 0; margin: 0;">
                        ${module.objectives.slice(0, 3).map(objective => `
                          <li style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; font-size: 0.875rem; color: var(--gray-700);">
                            <i class="fas fa-check-circle" style="color: var(--success); font-size: 0.75rem;"></i>
                            ${objective}
                          </li>
                        `).join('')}
                        ${module.objectives.length > 3 ? `
                          <li style="font-size: 0.875rem; color: var(--gray-500); margin-top: 0.5rem;">
                            +${module.objectives.length - 3} more objectives...
                          </li>
                        ` : ''}
                      </ul>
                    </div>

                    <button class="btn ${isCompleted ? 'btn-success' : 'btn-primary'}" 
                            onclick="window.TrainingSystem.startTrainingModule(${module.id}, '${user.id}')" 
                            style="width: 100%; padding: 1rem;">
                      <i class="fas fa-${isCompleted ? 'redo' : 'play'}"></i>
                      ${isCompleted ? 'Review Module' : 'Start Training'}
                    </button>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderProfile() {
    const user = authSystem.getCurrentUser();
    const trainingStats = window.TrainingSystem.getTrainingStats(user.id);
    
    return `
      <div class="dashboard-header">
        <h1 class="dashboard-title">Green Champion Profile</h1>
        <p class="dashboard-subtitle">Manage your profile and view your environmental leadership impact</p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 2rem;">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Profile Information</h3>
          </div>
          <div class="card-body">
            <div style="text-align: center; margin-bottom: 2rem;">
              <div style="width: 100px; height: 100px; border-radius: 50%; background: var(--primary); display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; color: white; font-size: 2.5rem; font-weight: 700;">
                ${user.name.charAt(0).toUpperCase()}
              </div>
              <h3 style="margin-bottom: 0.5rem;">${user.name}</h3>
              <p style="color: var(--gray-600);">Environmental Champion</p>
              <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: 1rem;">
                <i class="fas fa-crown" style="color: var(--warning);"></i>
                <span style="font-weight: 600;">Level ${trainingStats.level} Leader</span>
              </div>
            </div>
            
            <div class="profile-stats">
              <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--gray-200);">
                <span>Champion ID:</span>
                <strong>GC-001</strong>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--gray-200);">
                <span>District:</span>
                <strong>Central District</strong>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--gray-200);">
                <span>Community Rank:</span>
                <strong style="color: var(--warning);">#2</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>Joined:</span>
                <strong>${Utils.formatDate(user.joinedAt || new Date())}</strong>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Account Settings</h3>
          </div>
          <div class="card-body">
            <form class="profile-form">
              <div class="form-group" style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Full Name</label>
                <input type="text" class="form-control" value="${user.name}">
              </div>
              <div class="form-group" style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Email Address</label>
                <input type="email" class="form-control" value="${user.email}">
              </div>
              <div class="form-group" style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Phone Number</label>
                <input type="tel" class="form-control" placeholder="Enter phone number">
              </div>
              <div class="form-group" style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Area of Focus</label>
                <select class="form-control">
                  <option>Waste Management</option>
                  <option>Community Education</option>
                  <option>Environmental Advocacy</option>
                  <option>Youth Programs</option>
                </select>
              </div>
              <div class="form-group" style="margin-bottom: 2rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Bio</label>
                <textarea class="form-control" rows="3" placeholder="Tell your community about your environmental mission..."></textarea>
              </div>
              <div class="form-actions">
                <button type="submit" class="btn btn-primary">
                  <i class="fas fa-save"></i>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Leadership Impact</h3>
          </div>
          <div class="card-body">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem;">
              <div class="impact-metric" style="text-align: center; padding: 1.5rem; background: var(--gray-50); border-radius: 12px;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">👥</div>
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary); margin-bottom: 0.5rem;">156</div>
                <div style="color: var(--gray-600);">Citizens Engaged</div>
                <div style="font-size: 0.875rem; color: var(--gray-500);">Through your programs</div>
              </div>
              
              <div class="impact-metric" style="text-align: center; padding: 1.5rem; background: var(--gray-50); border-radius: 12px;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">📚</div>
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--success); margin-bottom: 0.5rem;">8</div>
                <div style="color: var(--gray-600);">Workshops Conducted</div>
                <div style="font-size: 0.875rem; color: var(--gray-500);">This quarter</div>
              </div>
              
              <div class="impact-metric" style="text-align: center; padding: 1.5rem; background: var(--gray-50); border-radius: 12px;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🌍</div>
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--warning); margin-bottom: 0.5rem;">245kg</div>
                <div style="color: var(--gray-600);">CO₂ Prevented</div>
                <div style="font-size: 0.875rem; color: var(--gray-500);">Environmental impact</div>
              </div>
              
              <div class="impact-metric" style="text-align: center; padding: 1.5rem; background: var(--gray-50); border-radius: 12px;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🏆</div>
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--secondary); margin-bottom: 0.5rem;">12</div>
                <div style="color: var(--gray-600);">Awards Received</div>
                <div style="font-size: 0.875rem; color: var(--gray-500);">Recognition badges</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Green Champion specific methods
  createCommunityEvent() {
    const content = `
      <form class="event-form">
        <div class="form-group" style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Event Name</label>
          <input type="text" class="form-control" placeholder="Enter event name" required>
        </div>
        
        <div class="form-group" style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Event Type</label>
          <select class="form-control" required>
            <option value="">Select event type</option>
            <option value="cleanup">Community Cleanup</option>
            <option value="workshop">Educational Workshop</option>
            <option value="awareness">Awareness Campaign</option>
            <option value="planting">Tree Planting</option>
          </select>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
          <div class="form-group">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Date</label>
            <input type="date" class="form-control" required>
          </div>
          <div class="form-group">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Time</label>
            <input type="time" class="form-control" required>
          </div>
        </div>
        
        <div class="form-group" style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Location</label>
          <input type="text" class="form-control" placeholder="Event location" required>
        </div>
        
        <div class="form-group" style="margin-bottom: 2rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Description</label>
          <textarea class="form-control" rows="4" placeholder="Describe the event and its objectives..." required></textarea>
        </div>
        
        <div style="display: flex; gap: 1rem; justify-content: flex-end;">
          <button type="button" class="btn btn-ghost" onclick="modal.hide()">Cancel</button>
          <button type="submit" class="btn btn-primary">
            <i class="fas fa-calendar-plus"></i>
            Create Event
          </button>
        </div>
      </form>
    `;

    modal.show('Create Community Event', content, { size: '600px' });
  }

  submitNewReport() {
    modal.showComplaintForm();
  }

  viewReport(reportId) {
    notifications.info('Report Details', `Viewing details for report ${reportId}`);
  }

  editReport(reportId) {
    notifications.info('Edit Report', `Editing report ${reportId}`);
  }

  redeemReward(rewardName, points) {
    const user = authSystem.getCurrentUser();
    if ((user.greenPoints || 0) >= points) {
      user.greenPoints = (user.greenPoints || 0) - points;
      authSystem.updateUserProfile(user);
      notifications.success('Reward Redeemed!', `You've successfully redeemed ${rewardName}`);
      this.refresh();
    } else {
      notifications.warning('Insufficient Points', 'You need more points to redeem this reward');
    }
  }

  manageEvent(eventName) {
    notifications.info('Event Management', `Managing event: ${eventName}`);
  }

  viewEventReport(eventName) {
    notifications.info('Event Report', `Viewing report for: ${eventName}`);
  }

  refreshHeatMap() {
    notifications.info('Refreshing Map', 'Updating environmental data...');
    setTimeout(() => {
      notifications.success('Map Updated', 'Heat map data has been refreshed');
    }, 1500);
  }

  showCertificates() {
    const user = authSystem.getCurrentUser();
    const certificates = window.TrainingSystem.getUserCertificates(user.id);
    
    if (certificates.length === 0) {
      const content = `
        <div style="text-align: center; padding: 2rem;">
          <div style="font-size: 4rem; margin-bottom: 1rem;">🏆</div>
          <h3 style="margin-bottom: 1rem;">No Leadership Certificates Yet</h3>
          <p style="color: var(--gray-600); margin-bottom: 2rem;">Complete all leadership training modules to earn your certificate!</p>
          <button class="btn btn-primary" onclick="modal.hide(); navigation.navigateTo('training');">
            <i class="fas fa-graduation-cap"></i>
            Start Leadership Training
          </button>
        </div>
      `;
      modal.show('My Certificates', content);
      return;
    }

    const content = `
      <div class="certificates-list">
        <h3 style="text-align: center; margin-bottom: 2rem;">🏆 My Leadership Certificates</h3>
        
        ${certificates.map(cert => `
          <div class="certificate-item" style="border: 1px solid var(--gray-200); border-radius: 12px; padding: 2rem; margin-bottom: 1rem; background: var(--white);">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
              <div>
                <h4 style="margin-bottom: 0.5rem; color: var(--primary);">${cert.title}</h4>
                <p style="color: var(--gray-600); margin: 0;">Issued: ${Utils.formatDate(new Date(cert.issueDate))}</p>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">👑</div>
                <div style="font-size: 0.875rem; color: var(--gray-500);">ID: ${cert.id}</div>
              </div>
            </div>
            
            <div style="display: flex; gap: 1rem; justify-content: flex-end;">
              <button class="btn btn-secondary" onclick="window.TrainingSystem.exportCertificate('${cert.id}')">
                <i class="fas fa-download"></i>
                View Certificate
              </button>
            </div>
          </div>
        `).join('')}
        
        <div style="text-align: center; margin-top: 2rem;">
          <button class="btn btn-primary" onclick="modal.hide()">Close</button>
        </div>
      </div>
    `;

    modal.show('My Leadership Certificates', content, { size: '700px' });
  }

  showMentorshipProgram() {
    const content = `
      <div class="mentorship-program">
        <h3 style="text-align: center; margin-bottom: 2rem;">🎓 Mentorship Program</h3>
        
        <div style="text-align: center; margin-bottom: 2rem;">
          <div style="font-size: 4rem; margin-bottom: 1rem;">🤝</div>
          <h4 style="margin-bottom: 1rem;">Become a Community Mentor</h4>
          <p style="color: var(--gray-600); max-width: 500px; margin: 0 auto;">
            Share your knowledge and help other citizens become environmental champions. 
            Earn extra points and recognition for your mentoring efforts.
          </p>
        </div>

        <div class="mentorship-stats" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem;">
          <div style="text-align: center; padding: 1rem; background: var(--gray-50); border-radius: 8px;">
            <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">28</div>
            <div style="font-size: 0.875rem; color: var(--gray-600);">Citizens Mentored</div>
          </div>
          <div style="text-align: center; padding: 1rem; background: var(--gray-50); border-radius: 8px;">
            <div style="font-size: 1.5rem; font-weight: 700; color: var(--success);">15</div>
            <div style="font-size: 0.875rem; color: var(--gray-600);">Workshops Led</div>
          </div>
          <div style="text-align: center; padding: 1rem; background: var(--gray-50); border-radius: 8px;">
            <div style="font-size: 1.5rem; font-weight: 700; color: var(--warning);">850</div>
            <div style="font-size: 0.875rem; color: var(--gray-600);">Mentor Points</div>
          </div>
        </div>

        <div class="mentorship-benefits" style="background: var(--gray-50); padding: 2rem; border-radius: 12px; margin-bottom: 2rem;">
          <h4 style="margin-bottom: 1rem; text-align: center;">Mentorship Benefits</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            <div style="text-align: center;">
              <i class="fas fa-coins" style="font-size: 2rem; color: var(--warning); margin-bottom: 0.5rem;"></i>
              <div style="font-weight: 600;">Extra Points</div>
              <div style="font-size: 0.875rem; color: var(--gray-600);">Earn bonus points for mentoring</div>
            </div>
            <div style="text-align: center;">
              <i class="fas fa-medal" style="font-size: 2rem; color: var(--success); margin-bottom: 0.5rem;"></i>
              <div style="font-weight: 600;">Recognition</div>
              <div style="font-size: 0.875rem; color: var(--gray-600);">Special mentor badges</div>
            </div>
            <div style="text-align: center;">
              <i class="fas fa-network-wired" style="font-size: 2rem; color: var(--primary); margin-bottom: 0.5rem;"></i>
              <div style="font-weight: 600;">Network</div>
              <div style="font-size: 0.875rem; color: var(--gray-600);">Build community connections</div>
            </div>
          </div>
        </div>

        <div style="text-align: center;">
          <button class="btn btn-primary" onclick="window.GreenChampionDashboard.joinMentorProgram()">
            <i class="fas fa-handshake"></i>
            Join Mentor Program
          </button>
        </div>
      </div>
    `;

    modal.show('Mentorship Program', content, { size: '700px' });
  }

  joinMentorProgram() {
    notifications.success('Welcome Mentor!', 'You\'ve joined the mentorship program. We\'ll match you with citizens soon!');
    modal.hide();
  }

  bindEvents() {
    // Bind any specific events for the current section
  }

  refresh() {
    this.loadSection(this.currentSection);
  }
}

// Initialize and export
window.GreenChampionDashboard = new GreenChampionDashboard();