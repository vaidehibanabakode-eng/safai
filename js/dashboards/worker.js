// Worker Dashboard
class WorkerDashboard {
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
      case 'my-tasks':
        content.innerHTML = this.renderMyTasks();
        break;
      case 'attendance':
        content.innerHTML = this.renderAttendance();
        break;
      case 'location':
        content.innerHTML = this.renderLocation();
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
        <h1 class="dashboard-title">Worker Dashboard</h1>
        <p class="dashboard-subtitle">Welcome back, ${user.name}! Ready for today's tasks</p>
      </div>

      <div class="dashboard-stats">
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">Today's Tasks</span>
            <div class="stat-icon primary">
              <i class="fas fa-clipboard-list"></i>
            </div>
          </div>
          <div class="stat-value">8</div>
          <div class="stat-change positive">
            <i class="fas fa-check"></i>
            5 completed
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">Route Progress</span>
            <div class="stat-icon success">
              <i class="fas fa-route"></i>
            </div>
          </div>
          <div class="stat-value">65%</div>
          <div class="stat-change positive">
            <i class="fas fa-arrow-up"></i>
            On schedule
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">Training Level</span>
            <div class="stat-icon warning">
              <i class="fas fa-graduation-cap"></i>
            </div>
          </div>
          <div class="stat-value">${trainingStats.level}</div>
          <div class="stat-change positive">
            <i class="fas fa-star"></i>
            ${trainingStats.xp} XP
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">Performance</span>
            <div class="stat-icon secondary">
              <i class="fas fa-chart-line"></i>
            </div>
          </div>
          <div class="stat-value">4.8</div>
          <div class="stat-change positive">
            <i class="fas fa-star"></i>
            Excellent rating
          </div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; margin-top: 2rem;">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Current Tasks</h3>
            <button class="btn btn-primary" onclick="navigation.navigateTo('my-tasks')">
              <i class="fas fa-eye"></i>
              View All Tasks
            </button>
          </div>
          <div class="card-body">
            ${this.renderCurrentTasks()}
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Quick Actions</h3>
          </div>
          <div class="card-body">
            <div style="display: flex; flex-direction: column; gap: 1rem;">
              <button class="btn btn-success" onclick="window.WorkerDashboard.markAttendance()">
                <i class="fas fa-calendar-check"></i>
                Mark Attendance
              </button>
              <button class="btn btn-secondary" onclick="navigation.navigateTo('location')">
                <i class="fas fa-map-marker-alt"></i>
                Update Location
              </button>
              <button class="btn btn-info" onclick="navigation.navigateTo('training')">
                <i class="fas fa-graduation-cap"></i>
                Training Modules
              </button>
              <button class="btn btn-warning" onclick="window.WorkerDashboard.reportIssue()">
                <i class="fas fa-exclamation-triangle"></i>
                Report Issue
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Today's Route</h3>
          </div>
          <div class="card-body">
            <div class="map-container" style="height: 300px;">
              <div class="map-placeholder">
                <i class="fas fa-route" style="font-size: 3rem; color: var(--gray-400); margin-bottom: 1rem;"></i>
                <h3 style="margin-bottom: 1rem;">Route Map</h3>
                <p style="color: var(--gray-600); margin-bottom: 2rem;">
                  Your assigned collection route for today
                </p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem; max-width: 500px; margin: 0 auto;">
                  <div style="text-align: center;">
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">Zone A</div>
                    <div style="font-size: 0.875rem; color: var(--gray-600);">Assigned Zone</div>
                  </div>
                  <div style="text-align: center;">
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--success);">12</div>
                    <div style="font-size: 0.875rem; color: var(--gray-600);">Stops Total</div>
                  </div>
                  <div style="text-align: center;">
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--warning);">8</div>
                    <div style="font-size: 0.875rem; color: var(--gray-600);">Completed</div>
                  </div>
                  <div style="text-align: center;">
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--secondary);">4</div>
                    <div style="font-size: 0.875rem; color: var(--gray-600);">Remaining</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderCurrentTasks() {
    const tasks = [
      { id: 'T001', location: 'Main Street Market', type: 'Collection', status: 'in_progress', priority: 'high', time: '10:30 AM' },
      { id: 'T002', location: 'Green Valley Apartments', type: 'Collection', status: 'pending', priority: 'medium', time: '11:00 AM' },
      { id: 'T003', location: 'School Area', type: 'Maintenance', status: 'pending', priority: 'low', time: '2:00 PM' }
    ];

    return `
      <div class="tasks-list">
        ${tasks.map(task => `
          <div class="task-item" style="display: flex; align-items: center; padding: 1rem 0; border-bottom: 1px solid var(--gray-200);">
            <div style="flex: 1;">
              <div style="font-weight: 600; margin-bottom: 0.25rem;">${task.location}</div>
              <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
                <span class="badge badge-info">${task.type}</span>
                ${Utils.getStatusBadge(task.status)}
                ${Utils.getPriorityBadge(task.priority)}
                <span style="font-size: 0.875rem; color: var(--gray-500);">${task.time}</span>
              </div>
            </div>
            <div style="display: flex; gap: 0.5rem;">
              ${task.status === 'in_progress' ? `
                <button class="btn btn-success" onclick="window.WorkerDashboard.completeTask('${task.id}')" title="Mark Complete">
                  <i class="fas fa-check"></i>
                </button>
              ` : task.status === 'pending' ? `
                <button class="btn btn-primary" onclick="window.WorkerDashboard.startTask('${task.id}')" title="Start Task">
                  <i class="fas fa-play"></i>
                </button>
              ` : ''}
              <button class="btn btn-ghost" onclick="window.WorkerDashboard.viewTask('${task.id}')" title="View Details">
                <i class="fas fa-eye"></i>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderMyTasks() {
    return `
      <div class="dashboard-header">
        <h1 class="dashboard-title">My Tasks</h1>
        <p class="dashboard-subtitle">Manage your assigned tasks and routes</p>
      </div>

      <div class="dashboard-stats" style="margin-bottom: 2rem;">
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">Pending Tasks</span>
            <div class="stat-icon warning">
              <i class="fas fa-clock"></i>
            </div>
          </div>
          <div class="stat-value">3</div>
          <div class="stat-change positive">
            <i class="fas fa-list"></i>
            Need attention
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">In Progress</span>
            <div class="stat-icon primary">
              <i class="fas fa-spinner"></i>
            </div>
          </div>
          <div class="stat-value">1</div>
          <div class="stat-change positive">
            <i class="fas fa-arrow-right"></i>
            Currently working
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">Completed Today</span>
            <div class="stat-icon success">
              <i class="fas fa-check"></i>
            </div>
          </div>
          <div class="stat-value">5</div>
          <div class="stat-change positive">
            <i class="fas fa-arrow-up"></i>
            Great progress
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Task List</h3>
          <div style="display: flex; gap: 1rem;">
            <select class="form-control" style="width: auto;">
              <option>All Tasks</option>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
            <select class="form-control" style="width: auto;">
              <option>All Types</option>
              <option>Collection</option>
              <option>Maintenance</option>
              <option>Emergency</option>
            </select>
          </div>
        </div>
        <div class="card-body">
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Task ID</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Scheduled Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${this.generateTaskRows()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  generateTaskRows() {
    const tasks = [
      { id: 'T001', location: 'Main Street Market', type: 'Collection', priority: 'high', status: 'in_progress', time: '10:30 AM' },
      { id: 'T002', location: 'Green Valley Apartments', type: 'Collection', priority: 'medium', status: 'pending', time: '11:00 AM' },
      { id: 'T003', location: 'School Area', type: 'Maintenance', priority: 'low', status: 'pending', time: '2:00 PM' },
      { id: 'T004', location: 'Central Park', type: 'Collection', priority: 'medium', status: 'completed', time: '9:00 AM' },
      { id: 'T005', location: 'Industrial Area', type: 'Emergency', priority: 'high', status: 'pending', time: '3:30 PM' }
    ];

    return tasks.map(task => `
      <tr>
        <td>${task.id}</td>
        <td>${task.location}</td>
        <td><span class="badge badge-info">${task.type}</span></td>
        <td>${Utils.getPriorityBadge(task.priority)}</td>
        <td>${Utils.getStatusBadge(task.status)}</td>
        <td>${task.time}</td>
        <td>
          <div style="display: flex; gap: 0.5rem;">
            ${task.status === 'pending' ? `
              <button class="btn btn-primary" onclick="window.WorkerDashboard.startTask('${task.id}')" title="Start">
                <i class="fas fa-play"></i>
              </button>
            ` : task.status === 'in_progress' ? `
              <button class="btn btn-success" onclick="window.WorkerDashboard.completeTask('${task.id}')" title="Complete">
                <i class="fas fa-check"></i>
              </button>
            ` : ''}
            <button class="btn btn-ghost" onclick="window.WorkerDashboard.viewTask('${task.id}')" title="View">
              <i class="fas fa-eye"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  renderAttendance() {
    return `
      <div class="dashboard-header">
        <h1 class="dashboard-title">Attendance Management</h1>
        <p class="dashboard-subtitle">Track your work hours and attendance</p>
      </div>

      <div class="dashboard-stats" style="margin-bottom: 2rem;">
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">Today's Status</span>
            <div class="stat-icon success">
              <i class="fas fa-calendar-check"></i>
            </div>
          </div>
          <div class="stat-value">Present</div>
          <div class="stat-change positive">
            <i class="fas fa-clock"></i>
            8:30 AM check-in
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">This Month</span>
            <div class="stat-icon primary">
              <i class="fas fa-calendar"></i>
            </div>
          </div>
          <div class="stat-value">22/24</div>
          <div class="stat-change positive">
            <i class="fas fa-percentage"></i>
            92% attendance
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">Hours Worked</span>
            <div class="stat-icon warning">
              <i class="fas fa-clock"></i>
            </div>
          </div>
          <div class="stat-value">176h</div>
          <div class="stat-change positive">
            <i class="fas fa-arrow-up"></i>
            This month
          </div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Today's Attendance</h3>
          </div>
          <div class="card-body">
            <div class="attendance-actions" style="display: flex; flex-direction: column; gap: 1rem;">
              <div class="attendance-status" style="text-align: center; padding: 2rem; background: var(--success); color: white; border-radius: 12px; margin-bottom: 2rem;">
                <i class="fas fa-check-circle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <h3>Checked In</h3>
                <p style="margin: 0; opacity: 0.9;">Started work at 8:30 AM</p>
              </div>
              
              <button class="btn btn-primary" onclick="window.WorkerDashboard.markBreak()">
                <i class="fas fa-coffee"></i>
                Take Break
              </button>
              
              <button class="btn btn-warning" onclick="window.WorkerDashboard.checkOut()">
                <i class="fas fa-sign-out-alt"></i>
                Check Out
              </button>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Recent Attendance</h3>
          </div>
          <div class="card-body">
            <div class="attendance-history">
              ${this.renderAttendanceHistory()}
            </div>
          </div>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Monthly Overview</h3>
          </div>
          <div class="card-body">
            <div class="calendar-view" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 1rem; text-align: center;">
              <div style="font-weight: 600; color: var(--gray-700);">Mon</div>
              <div style="font-weight: 600; color: var(--gray-700);">Tue</div>
              <div style="font-weight: 600; color: var(--gray-700);">Wed</div>
              <div style="font-weight: 600; color: var(--gray-700);">Thu</div>
              <div style="font-weight: 600; color: var(--gray-700);">Fri</div>
              <div style="font-weight: 600; color: var(--gray-700);">Sat</div>
              <div style="font-weight: 600; color: var(--gray-700);">Sun</div>
              
              ${Array.from({length: 31}, (_, i) => {
                const day = i + 1;
                const status = Math.random() > 0.1 ? 'present' : 'absent';
                return `
                  <div style="padding: 0.5rem; border-radius: 8px; background: ${status === 'present' ? 'var(--success)' : 'var(--error)'}; color: white; font-weight: 600;">
                    ${day}
                  </div>
                `;
              }).join('')}
            </div>
            
            <div style="display: flex; justify-content: center; gap: 2rem; margin-top: 2rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <div style="width: 16px; height: 16px; background: var(--success); border-radius: 4px;"></div>
                <span>Present</span>
              </div>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <div style="width: 16px; height: 16px; background: var(--error); border-radius: 4px;"></div>
                <span>Absent</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderAttendanceHistory() {
    const history = [
      { date: '2024-01-15', checkIn: '8:30 AM', checkOut: '5:00 PM', hours: '8.5h', status: 'present' },
      { date: '2024-01-14', checkIn: '8:45 AM', checkOut: '5:15 PM', hours: '8.5h', status: 'present' },
      { date: '2024-01-13', checkIn: '9:00 AM', checkOut: '5:30 PM', hours: '8.5h', status: 'present' },
      { date: '2024-01-12', checkIn: '-', checkOut: '-', hours: '0h', status: 'absent' }
    ];

    return history.map(record => `
      <div class="attendance-record" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid var(--gray-200);">
        <div>
          <div style="font-weight: 600; margin-bottom: 0.25rem;">${record.date}</div>
          <div style="font-size: 0.875rem; color: var(--gray-600);">
            ${record.checkIn} - ${record.checkOut}
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-weight: 600; margin-bottom: 0.25rem;">${record.hours}</div>
          <span class="badge ${record.status === 'present' ? 'badge-success' : 'badge-error'}">
            ${record.status === 'present' ? 'Present' : 'Absent'}
          </span>
        </div>
      </div>
    `).join('');
  }

  renderLocation() {
    return `
      <div class="dashboard-header">
        <h1 class="dashboard-title">Location Tracking</h1>
        <p class="dashboard-subtitle">Share your location for efficient task coordination</p>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Current Location</h3>
          <div style="display: flex; gap: 1rem;">
            <button class="btn btn-secondary" onclick="window.WorkerDashboard.refreshLocation()">
              <i class="fas fa-sync"></i>
              Refresh
            </button>
            <button class="btn btn-primary" onclick="window.WorkerDashboard.shareLocation()">
              <i class="fas fa-share-alt"></i>
              Share Location
            </button>
          </div>
        </div>
        <div class="card-body">
          <div class="map-container" style="height: 400px; margin-bottom: 2rem;">
            <div class="map-placeholder">
              <i class="fas fa-map-marker-alt" style="font-size: 4rem; color: var(--primary); margin-bottom: 1rem;"></i>
              <h3 style="margin-bottom: 1rem;">Your Current Location</h3>
              <p style="color: var(--gray-600); margin-bottom: 2rem;">
                Real-time location tracking for task coordination
              </p>
              <div style="background: var(--gray-50); padding: 1.5rem; border-radius: 12px; max-width: 400px; margin: 0 auto;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; text-align: center;">
                  <div>
                    <div style="font-size: 1.2rem; font-weight: 700; color: var(--primary);">28.6139°N</div>
                    <div style="font-size: 0.875rem; color: var(--gray-600);">Latitude</div>
                  </div>
                  <div>
                    <div style="font-size: 1.2rem; font-weight: 700; color: var(--primary);">77.2090°E</div>
                    <div style="font-size: 0.875rem; color: var(--gray-600);">Longitude</div>
                  </div>
                </div>
                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--gray-200); text-align: center;">
                  <div style="font-size: 0.875rem; color: var(--gray-600);">Last Updated</div>
                  <div style="font-weight: 600;">Just now</div>
                </div>
              </div>
            </div>
          </div>

          <div class="location-settings">
            <h4 style="margin-bottom: 1rem;">Location Settings</h4>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
              <label style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: var(--gray-50); border-radius: 8px;">
                <input type="checkbox" checked>
                <div>
                  <div style="font-weight: 600;">Auto-share location during work hours</div>
                  <div style="font-size: 0.875rem; color: var(--gray-600);">Automatically share your location when on duty</div>
                </div>
              </label>
              
              <label style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: var(--gray-50); border-radius: 8px;">
                <input type="checkbox" checked>
                <div>
                  <div style="font-weight: 600;">Location history</div>
                  <div style="font-size: 0.875rem; color: var(--gray-600);">Keep track of your work locations for reports</div>
                </div>
              </label>
              
              <label style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: var(--gray-50); border-radius: 8px;">
                <input type="checkbox">
                <div>
                  <div style="font-weight: 600;">Emergency location sharing</div>
                  <div style="font-size: 0.875rem; color: var(--gray-600);">Share location in case of emergency situations</div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Location History</h3>
          </div>
          <div class="card-body">
            <div class="location-history">
              ${this.renderLocationHistory()}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderLocationHistory() {
    const history = [
      { time: '2:30 PM', location: 'Main Street Market', task: 'Collection completed', status: 'completed' },
      { time: '1:45 PM', location: 'Green Valley Apartments', task: 'Collection in progress', status: 'active' },
      { time: '12:30 PM', location: 'Central Depot', task: 'Lunch break', status: 'break' },
      { time: '11:15 AM', location: 'School Area', task: 'Collection completed', status: 'completed' }
    ];

    return history.map(record => `
      <div class="location-record" style="display: flex; align-items: center; gap: 1rem; padding: 1rem 0; border-bottom: 1px solid var(--gray-200);">
        <div style="width: 40px; height: 40px; border-radius: 50%; background: ${record.status === 'completed' ? 'var(--success)' : record.status === 'active' ? 'var(--primary)' : 'var(--warning)'}; display: flex; align-items: center; justify-content: center; color: white;">
          <i class="fas fa-${record.status === 'completed' ? 'check' : record.status === 'active' ? 'spinner' : 'coffee'}"></i>
        </div>
        <div style="flex: 1;">
          <div style="font-weight: 600; margin-bottom: 0.25rem;">${record.location}</div>
          <div style="font-size: 0.875rem; color: var(--gray-600);">${record.task}</div>
        </div>
        <div style="text-align: right; color: var(--gray-500); font-size: 0.875rem;">
          ${record.time}
        </div>
      </div>
    `).join('');
  }

  renderTraining() {
    const user = authSystem.getCurrentUser();
    const trainingStats = window.TrainingSystem.getTrainingStats(user.id);
    const modules = ENHANCED_TRAINING_MODULES.worker || [];

    return `
      <div class="dashboard-header">
        <h1 class="dashboard-title">Safety & Skills Training</h1>
        <p class="dashboard-subtitle">Enhance your skills and earn certifications for better performance</p>
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
            <span class="stat-title">Streak</span>
            <div class="stat-icon error">
              <i class="fas fa-fire"></i>
            </div>
          </div>
          <div class="stat-value">${trainingStats.currentStreak}</div>
          <div class="stat-change positive">
            <i class="fas fa-calendar"></i>
            Days in a row
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">Safety Score</span>
            <div class="stat-icon success">
              <i class="fas fa-shield-alt"></i>
            </div>
          </div>
          <div class="stat-value">95%</div>
          <div class="stat-change positive">
            <i class="fas fa-arrow-up"></i>
            Excellent
          </div>
        </div>
      </div>

      <div class="training-modules">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Training Modules</h3>
            <div style="display: flex; gap: 1rem;">
              <button class="btn btn-secondary" onclick="window.WorkerDashboard.showCertificates()">
                <i class="fas fa-certificate"></i>
                My Certificates
              </button>
              <button class="btn btn-info" onclick="window.WorkerDashboard.showSafetyTips()">
                <i class="fas fa-lightbulb"></i>
                Safety Tips
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
        <h1 class="dashboard-title">Worker Profile</h1>
        <p class="dashboard-subtitle">Manage your profile and view performance metrics</p>
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
              <p style="color: var(--gray-600);">Waste Collection Worker</p>
              <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: 1rem;">
                <i class="fas fa-star" style="color: var(--warning);"></i>
                <span style="font-weight: 600;">Level ${trainingStats.level}</span>
              </div>
            </div>
            
            <div class="profile-stats">
              <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--gray-200);">
                <span>Employee ID:</span>
                <strong>WRK-001</strong>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--gray-200);">
                <span>Zone Assignment:</span>
                <strong>Zone A</strong>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--gray-200);">
                <span>Performance Rating:</span>
                <strong style="color: var(--success);">4.8/5.0</strong>
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
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Emergency Contact</label>
                <input type="tel" class="form-control" placeholder="Emergency contact number">
              </div>
              <div class="form-group" style="margin-bottom: 2rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Notification Preferences</label>
                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                  <label style="display: flex; align-items: center; gap: 0.5rem;">
                    <input type="checkbox" checked>
                    <span>Task assignment notifications</span>
                  </label>
                  <label style="display: flex; align-items: center; gap: 0.5rem;">
                    <input type="checkbox" checked>
                    <span>Schedule change alerts</span>
                  </label>
                  <label style="display: flex; align-items: center; gap: 0.5rem;">
                    <input type="checkbox">
                    <span>Training reminders</span>
                  </label>
                </div>
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
            <h3 class="card-title">Performance Metrics</h3>
          </div>
          <div class="card-body">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem;">
              <div class="metric-item" style="text-align: center; padding: 1.5rem; background: var(--gray-50); border-radius: 12px;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">📋</div>
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary); margin-bottom: 0.5rem;">247</div>
                <div style="color: var(--gray-600);">Tasks Completed</div>
                <div style="font-size: 0.875rem; color: var(--gray-500);">This month</div>
              </div>
              
              <div class="metric-item" style="text-align: center; padding: 1.5rem; background: var(--gray-50); border-radius: 12px;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">⏱️</div>
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--success); margin-bottom: 0.5rem;">95%</div>
                <div style="color: var(--gray-600);">On-Time Rate</div>
                <div style="font-size: 0.875rem; color: var(--gray-500);">Last 30 days</div>
              </div>
              
              <div class="metric-item" style="text-align: center; padding: 1.5rem; background: var(--gray-50); border-radius: 12px;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🛡️</div>
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--warning); margin-bottom: 0.5rem;">0</div>
                <div style="color: var(--gray-600);">Safety Incidents</div>
                <div style="font-size: 0.875rem; color: var(--gray-500);">This year</div>
              </div>
              
              <div class="metric-item" style="text-align: center; padding: 1.5rem; background: var(--gray-50); border-radius: 12px;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">⭐</div>
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--secondary); margin-bottom: 0.5rem;">4.8</div>
                <div style="color: var(--gray-600);">Average Rating</div>
                <div style="font-size: 0.875rem; color: var(--gray-500);">From supervisors</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Worker-specific methods
  markAttendance() {
    notifications.success('Attendance Marked', 'You have been marked present for today');
  }

  reportIssue() {
    const content = `
      <form class="issue-form">
        <div class="form-group" style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Issue Type</label>
          <select class="form-control" required>
            <option value="">Select issue type</option>
            <option value="equipment">Equipment Problem</option>
            <option value="safety">Safety Concern</option>
            <option value="route">Route Issue</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div class="form-group" style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Description</label>
          <textarea class="form-control" rows="4" placeholder="Describe the issue in detail..." required></textarea>
        </div>
        
        <div class="form-group" style="margin-bottom: 2rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Priority</label>
          <select class="form-control" required>
            <option value="low">Low - Can wait</option>
            <option value="medium" selected>Medium - Should be addressed</option>
            <option value="high">High - Urgent</option>
          </select>
        </div>
        
        <div style="display: flex; gap: 1rem; justify-content: flex-end;">
          <button type="button" class="btn btn-ghost" onclick="modal.hide()">Cancel</button>
          <button type="submit" class="btn btn-primary">
            <i class="fas fa-paper-plane"></i>
            Report Issue
          </button>
        </div>
      </form>
    `;

    modal.show('Report Issue', content);
  }

  startTask(taskId) {
    notifications.success('Task Started', `Task ${taskId} is now in progress`);
    this.refresh();
  }

  completeTask(taskId) {
    const content = `
      <div class="task-completion">
        <h3 style="text-align: center; margin-bottom: 2rem;">Complete Task ${taskId}</h3>
        
        <div class="form-group" style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Upload Completion Photo</label>
          <div class="photo-upload-area" style="border: 2px dashed var(--gray-300); border-radius: 8px; padding: 2rem; text-align: center; background: var(--gray-50);">
            <i class="fas fa-camera" style="font-size: 3rem; color: var(--gray-400); margin-bottom: 1rem;"></i>
            <p style="margin-bottom: 1rem; color: var(--gray-600);">Upload a photo showing completed work</p>
            <button type="button" class="btn btn-secondary">
              <i class="fas fa-camera"></i>
              Capture Photo
            </button>
          </div>
        </div>
        
        <div class="form-group" style="margin-bottom: 2rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Completion Notes</label>
          <textarea class="form-control" rows="3" placeholder="Any additional notes about the completed task..."></textarea>
        </div>
        
        <div style="display: flex; gap: 1rem; justify-content: flex-end;">
          <button class="btn btn-ghost" onclick="modal.hide()">Cancel</button>
          <button class="btn btn-success" onclick="window.WorkerDashboard.confirmTaskCompletion('${taskId}')">
            <i class="fas fa-check"></i>
            Mark Complete
          </button>
        </div>
      </div>
    `;

    modal.show('Complete Task', content, { size: '600px' });
  }

  confirmTaskCompletion(taskId) {
    notifications.success('Task Completed', `Task ${taskId} has been marked as complete`);
    modal.hide();
    this.refresh();
  }

  viewTask(taskId) {
    notifications.info('Task Details', `Viewing details for task ${taskId}`);
  }

  markBreak() {
    notifications.info('Break Started', 'Enjoy your break! Remember to check back in');
  }

  checkOut() {
    notifications.success('Checked Out', 'You have successfully checked out for the day');
  }

  refreshLocation() {
    notifications.info('Refreshing Location', 'Updating your current location...');
    setTimeout(() => {
      notifications.success('Location Updated', 'Your location has been refreshed');
    }, 1500);
  }

  shareLocation() {
    notifications.success('Location Shared', 'Your location is now being shared with the dispatch team');
  }

  showCertificates() {
    const user = authSystem.getCurrentUser();
    const certificates = window.TrainingSystem.getUserCertificates(user.id);
    
    if (certificates.length === 0) {
      const content = `
        <div style="text-align: center; padding: 2rem;">
          <div style="font-size: 4rem; margin-bottom: 1rem;">🏆</div>
          <h3 style="margin-bottom: 1rem;">No Certificates Yet</h3>
          <p style="color: var(--gray-600); margin-bottom: 2rem;">Complete all training modules to earn your safety certificate!</p>
          <button class="btn btn-primary" onclick="modal.hide(); navigation.navigateTo('training');">
            <i class="fas fa-graduation-cap"></i>
            Start Training
          </button>
        </div>
      `;
      modal.show('My Certificates', content);
      return;
    }

    const content = `
      <div class="certificates-list">
        <h3 style="text-align: center; margin-bottom: 2rem;">🏆 My Safety Certificates</h3>
        
        ${certificates.map(cert => `
          <div class="certificate-item" style="border: 1px solid var(--gray-200); border-radius: 12px; padding: 2rem; margin-bottom: 1rem; background: var(--white);">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
              <div>
                <h4 style="margin-bottom: 0.5rem; color: var(--primary);">${cert.title}</h4>
                <p style="color: var(--gray-600); margin: 0;">Issued: ${Utils.formatDate(new Date(cert.issueDate))}</p>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">🛡️</div>
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

    modal.show('My Safety Certificates', content, { size: '700px' });
  }

  showSafetyTips() {
    const tips = [
      {
        title: 'Personal Protective Equipment',
        icon: '🦺',
        tip: 'Always wear your complete PPE: hard hat, safety vest, gloves, and safety boots before starting work.'
      },
      {
        title: 'Lifting Techniques',
        icon: '💪',
        tip: 'Bend your knees, not your back. Keep the load close to your body and lift with your legs.'
      },
      {
        title: 'Vehicle Safety',
        icon: '🚛',
        tip: 'Always perform pre-trip inspections. Check brakes, lights, and hydraulic systems before starting your route.'
      },
      {
        title: 'Chemical Handling',
        icon: '⚠️',
        tip: 'Never handle unknown chemicals. Report spills immediately and keep safety data sheets accessible.'
      },
      {
        title: 'Weather Awareness',
        icon: '🌧️',
        tip: 'Adjust your work pace during extreme weather. Use extra caution on wet or icy surfaces.'
      }
    ];

    const content = `
      <div class="safety-tips">
        <h3 style="text-align: center; margin-bottom: 2rem;">🛡️ Daily Safety Tips</h3>
        
        <div class="tips-grid" style="display: grid; gap: 1rem;">
          ${tips.map(tip => `
            <div class="tip-card" style="display: flex; align-items: start; gap: 1rem; padding: 1.5rem; border: 1px solid var(--gray-200); border-radius: 12px; background: var(--white);">
              <div style="font-size: 2rem; flex-shrink: 0;">${tip.icon}</div>
              <div>
                <h4 style="margin-bottom: 0.5rem; color: var(--gray-900);">${tip.title}</h4>
                <p style="color: var(--gray-600); margin: 0; line-height: 1.5;">${tip.tip}</p>
              </div>
            </div>
          `).join('')}
        </div>
        
        <div style="text-align: center; margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--gray-200);">
          <p style="color: var(--gray-600); margin-bottom: 1rem;">Remember: Safety first, always!</p>
          <button class="btn btn-primary" onclick="modal.hide()">Got It!</button>
        </div>
      </div>
    `;

    modal.show('Safety Tips', content, { size: '600px' });
  }

  bindEvents() {
    // Bind any specific events for the current section
  }

  refresh() {
    this.loadSection(this.currentSection);
  }
}

// Initialize and export
window.WorkerDashboard = new WorkerDashboard();