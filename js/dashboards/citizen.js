// Citizen Dashboard
class CitizenDashboard {
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
      case 'submit-complaint':
        content.innerHTML = this.renderSubmitComplaint();
        break;
      case 'my-complaints':
        content.innerHTML = this.renderMyComplaints();
        break;
      case 'tracking':
        content.innerHTML = this.renderTracking();
        break;
      case 'shop':
        content.innerHTML = this.renderShop();
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
        <h1 class="dashboard-title">Citizen Dashboard</h1>
        <p class="dashboard-subtitle">Welcome back, ${user.name}! Make a difference in your community</p>
      </div>

      <div class="dashboard-stats">
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">Green Points</span>
            <div class="stat-icon success">
              <i class="fas fa-coins"></i>
            </div>
          </div>
          <div class="stat-value">${user.greenPoints || 0}</div>
          <div class="stat-change positive">
            <i class="fas fa-arrow-up"></i>
            Level ${trainingStats.level}
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">My Complaints</span>
            <div class="stat-icon warning">
              <i class="fas fa-exclamation-triangle"></i>
            </div>
          </div>
          <div class="stat-value">3</div>
          <div class="stat-change positive">
            <i class="fas fa-check"></i>
            2 resolved
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">Training Progress</span>
            <div class="stat-icon primary">
              <i class="fas fa-graduation-cap"></i>
            </div>
          </div>
          <div class="stat-value">${trainingStats.completionPercentage}%</div>
          <div class="stat-change positive">
            <i class="fas fa-fire"></i>
            ${trainingStats.currentStreak} day streak
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">Community Impact</span>
            <div class="stat-icon secondary">
              <i class="fas fa-users"></i>
            </div>
          </div>
          <div class="stat-value">4.8</div>
          <div class="stat-change positive">
            <i class="fas fa-star"></i>
            Community rating
          </div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; margin-top: 2rem;">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Quick Actions</h3>
          </div>
          <div class="card-body">
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
              <button class="btn btn-primary" onclick="navigation.navigateTo('submit-complaint')" style="padding: 1.5rem; display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
                <i class="fas fa-plus-circle" style="font-size: 2rem;"></i>
                <span>Report Issue</span>
              </button>
              <button class="btn btn-secondary" onclick="navigation.navigateTo('tracking')" style="padding: 1.5rem; display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
                <i class="fas fa-truck" style="font-size: 2rem;"></i>
                <span>Track Vehicle</span>
              </button>
              <button class="btn btn-success" onclick="navigation.navigateTo('training')" style="padding: 1.5rem; display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
                <i class="fas fa-graduation-cap" style="font-size: 2rem;"></i>
                <span>Learn & Earn</span>
              </button>
              <button class="btn btn-info" onclick="navigation.navigateTo('shop')" style="padding: 1.5rem; display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
                <i class="fas fa-shopping-cart" style="font-size: 2rem;"></i>
                <span>Eco Shop</span>
              </button>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Recent Activity</h3>
          </div>
          <div class="card-body">
            <div class="activity-feed">
              <div class="activity-item" style="display: flex; align-items: center; gap: 1rem; padding: 1rem 0; border-bottom: 1px solid var(--gray-200);">
                <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--success); display: flex; align-items: center; justify-content: center; color: white;">
                  <i class="fas fa-check"></i>
                </div>
                <div style="flex: 1;">
                  <div style="font-weight: 600; margin-bottom: 0.25rem;">Complaint Resolved</div>
                  <div style="font-size: 0.875rem; color: var(--gray-600);">Your overflowing bin report was fixed</div>
                  <div style="font-size: 0.75rem; color: var(--gray-500);">2 hours ago</div>
                </div>
              </div>
              
              <div class="activity-item" style="display: flex; align-items: center; gap: 1rem; padding: 1rem 0; border-bottom: 1px solid var(--gray-200);">
                <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--warning); display: flex; align-items: center; justify-content: center; color: white;">
                  <i class="fas fa-star"></i>
                </div>
                <div style="flex: 1;">
                  <div style="font-weight: 600; margin-bottom: 0.25rem;">Points Earned</div>
                  <div style="font-size: 0.875rem; color: var(--gray-600);">+50 points for training completion</div>
                  <div style="font-size: 0.75rem; color: var(--gray-500);">1 day ago</div>
                </div>
              </div>

              <div class="activity-item" style="display: flex; align-items: center; gap: 1rem; padding: 1rem 0;">
                <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--primary); display: flex; align-items: center; justify-content: center; color: white;">
                  <i class="fas fa-truck"></i>
                </div>
                <div style="flex: 1;">
                  <div style="font-weight: 600; margin-bottom: 0.25rem;">Collection Alert</div>
                  <div style="font-size: 0.875rem; color: var(--gray-600);">Garbage truck arriving in 10 minutes</div>
                  <div style="font-size: 0.75rem; color: var(--gray-500);">2 days ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Environmental Impact</h3>
          </div>
          <div class="card-body">
            <div class="impact-metrics" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem;">
              <div class="impact-item" style="text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🌱</div>
                <div style="font-size: 2rem; font-weight: 700; color: var(--success); margin-bottom: 0.5rem;">12.5kg</div>
                <div style="color: var(--gray-600);">CO₂ Saved This Month</div>
              </div>
              <div class="impact-item" style="text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">♻️</div>
                <div style="font-size: 2rem; font-weight: 700; color: var(--primary); margin-bottom: 0.5rem;">85%</div>
                <div style="color: var(--gray-600);">Recycling Rate</div>
              </div>
              <div class="impact-item" style="text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🏆</div>
                <div style="font-size: 2rem; font-weight: 700; color: var(--warning); margin-bottom: 0.5rem;">#3</div>
                <div style="color: var(--gray-600);">Community Ranking</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderSubmitComplaint() {
    return `
      <div class="dashboard-header">
        <h1 class="dashboard-title">Report an Issue</h1>
        <p class="dashboard-subtitle">Help us keep your community clean and green</p>
      </div>

      <div class="complaint-container">
        <div class="complaint-form-wrapper">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Submit New Complaint</h3>
            </div>
            <div class="card-body">
              <form class="complaint-form" id="complaintForm">
                <div class="form-group">
                  <label class="form-label">Issue Title</label>
                  <input type="text" class="form-control" id="complaintTitle" placeholder="Brief description of the issue" required>
                </div>

                <div class="form-group">
                  <label class="form-label">Category</label>
                  <select class="form-control" id="complaintCategory" required>
                    <option value="">Select category</option>
                    ${COMPLAINT_TYPES.map(type => `<option value="${type}">${type}</option>`).join('')}
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">Priority Level</label>
                  <select class="form-control" id="complaintPriority" required>
                    <option value="low">Low - Can wait a few days</option>
                    <option value="medium" selected>Medium - Should be addressed soon</option>
                    <option value="high">High - Urgent attention needed</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">Location</label>
                  <div class="location-input-group">
                    <input type="text" class="form-control" id="complaintLocation" placeholder="Enter specific location" required>
                    <button type="button" class="btn btn-secondary location-btn" onclick="window.CitizenDashboard.getCurrentLocation()">
                      <i class="fas fa-map-marker-alt"></i>
                      Use Current Location
                    </button>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Description</label>
                  <textarea class="form-control" id="complaintDescription" rows="4" placeholder="Provide detailed information about the issue..." required></textarea>
                </div>

                <div class="form-group">
                  <label class="form-label">Upload Photo (Optional)</label>
                  <div class="photo-upload-area" onclick="document.getElementById('photoInput').click()">
                    <i class="fas fa-camera"></i>
                    <p>Click to add a photo of the issue</p>
                    <input type="file" id="photoInput" class="photo-input" accept="image/*">
                  </div>
                </div>

                <div class="form-actions">
                  <button type="submit" class="btn btn-primary btn-block">
                    <i class="fas fa-paper-plane"></i>
                    Submit Complaint
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div class="complaint-sidebar">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Quick Tips</h3>
            </div>
            <div class="card-body">
              <div class="tips-list">
                <div class="tip-item" style="display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 1rem;">
                  <i class="fas fa-lightbulb" style="color: var(--warning); margin-top: 0.25rem;"></i>
                  <div>
                    <strong>Be Specific</strong>
                    <p style="margin: 0; font-size: 0.875rem; color: var(--gray-600);">Include exact location and detailed description</p>
                  </div>
                </div>
                <div class="tip-item" style="display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 1rem;">
                  <i class="fas fa-camera" style="color: var(--primary); margin-top: 0.25rem;"></i>
                  <div>
                    <strong>Add Photos</strong>
                    <p style="margin: 0; font-size: 0.875rem; color: var(--gray-600);">Visual evidence helps us understand the issue better</p>
                  </div>
                </div>
                <div class="tip-item" style="display: flex; align-items: flex-start; gap: 1rem;">
                  <i class="fas fa-clock" style="color: var(--success); margin-top: 0.25rem;"></i>
                  <div>
                    <strong>Track Progress</strong>
                    <p style="margin: 0; font-size: 0.875rem; color: var(--gray-600);">You'll receive updates on your complaint status</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="card" style="margin-top: 1rem;">
            <div class="card-header">
              <h3 class="card-title">Earn Green Points</h3>
            </div>
            <div class="card-body">
              <div style="text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🏆</div>
                <p style="margin-bottom: 1rem;">Earn points for valid complaints!</p>
                <div class="points-breakdown" style="font-size: 0.875rem; color: var(--gray-600);">
                  <div>High Priority: 50 points</div>
                  <div>Medium Priority: 30 points</div>
                  <div>Low Priority: 20 points</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderMyComplaints() {
    const complaints = [
      { id: 'C001', title: 'Overflowing bin on Main Street', status: 'resolved', priority: 'high', date: '2024-01-15', points: 50 },
      { id: 'C002', title: 'Missed garbage collection', status: 'in_progress', priority: 'medium', date: '2024-01-14', points: 0 },
      { id: 'C003', title: 'Broken waste container', status: 'pending', priority: 'low', date: '2024-01-13', points: 0 }
    ];

    return `
      <div class="dashboard-header">
        <h1 class="dashboard-title">My Complaints</h1>
        <p class="dashboard-subtitle">Track the status of your reported issues</p>
      </div>

      <div class="dashboard-stats" style="margin-bottom: 2rem;">
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">Total Complaints</span>
            <div class="stat-icon primary">
              <i class="fas fa-list"></i>
            </div>
          </div>
          <div class="stat-value">${complaints.length}</div>
          <div class="stat-change positive">
            <i class="fas fa-plus"></i>
            All time
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">Resolved</span>
            <div class="stat-icon success">
              <i class="fas fa-check-circle"></i>
            </div>
          </div>
          <div class="stat-value">${complaints.filter(c => c.status === 'resolved').length}</div>
          <div class="stat-change positive">
            <i class="fas fa-arrow-up"></i>
            Great progress
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">Points Earned</span>
            <div class="stat-icon warning">
              <i class="fas fa-coins"></i>
            </div>
          </div>
          <div class="stat-value">${complaints.reduce((sum, c) => sum + c.points, 0)}</div>
          <div class="stat-change positive">
            <i class="fas fa-star"></i>
            Keep it up!
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Complaint History</h3>
          <button class="btn btn-primary" onclick="navigation.navigateTo('submit-complaint')">
            <i class="fas fa-plus"></i>
            New Complaint
          </button>
        </div>
        <div class="card-body">
          <div class="complaints-list">
            ${complaints.map(complaint => `
              <div class="complaint-card" style="border: 1px solid var(--gray-200); border-radius: 12px; padding: 1.5rem; margin-bottom: 1rem; background: var(--white);">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                  <div>
                    <h4 style="margin-bottom: 0.5rem; color: var(--gray-900);">${complaint.title}</h4>
                    <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
                      ${Utils.getStatusBadge(complaint.status)}
                      ${Utils.getPriorityBadge(complaint.priority)}
                      <span style="font-size: 0.875rem; color: var(--gray-500);">ID: ${complaint.id}</span>
                    </div>
                  </div>
                  <div style="text-align: right;">
                    <div style="font-size: 0.875rem; color: var(--gray-500); margin-bottom: 0.5rem;">${complaint.date}</div>
                    ${complaint.points > 0 ? `
                      <div style="display: flex; align-items: center; gap: 0.25rem; color: var(--warning);">
                        <i class="fas fa-coins"></i>
                        <span style="font-weight: 600;">+${complaint.points}</span>
                      </div>
                    ` : ''}
                  </div>
                </div>
                
                <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                  <button class="btn btn-ghost" onclick="window.ComplaintManager.viewComplaint('${complaint.id}')" title="View Details">
                    <i class="fas fa-eye"></i>
                    View Details
                  </button>
                  ${complaint.status === 'pending' ? `
                    <button class="btn btn-ghost" onclick="modal.showComplaintForm(${JSON.stringify(complaint).replace(/"/g, '&quot;')})" title="Edit">
                      <i class="fas fa-edit"></i>
                      Edit
                    </button>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  renderTracking() {
    return `
      <div class="dashboard-header">
        <h1 class="dashboard-title">Vehicle Tracking</h1>
        <p class="dashboard-subtitle">Track garbage collection vehicles in real-time</p>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Live Vehicle Locations</h3>
          <div style="display: flex; gap: 1rem;">
            <button class="btn btn-secondary" onclick="window.CitizenDashboard.refreshTracking()">
              <i class="fas fa-sync"></i>
              Refresh
            </button>
            <button class="btn btn-primary" onclick="window.CitizenDashboard.enableNotifications()">
              <i class="fas fa-bell"></i>
              Enable Alerts
            </button>
          </div>
        </div>
        <div class="card-body">
          <div class="map-container" style="height: 400px; margin-bottom: 2rem;">
            <div class="map-placeholder">
              <i class="fas fa-map" style="font-size: 4rem; color: var(--gray-400); margin-bottom: 1rem;"></i>
              <h3 style="margin-bottom: 1rem;">Real-time Vehicle Tracking</h3>
              <p style="color: var(--gray-600); margin-bottom: 2rem;">
                Interactive map showing live locations of garbage collection vehicles
              </p>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; max-width: 600px; margin: 0 auto;">
                <div style="text-align: center;">
                  <div style="font-size: 1.5rem; font-weight: 700; color: var(--success);">3</div>
                  <div style="font-size: 0.875rem; color: var(--gray-600);">Active Vehicles</div>
                </div>
                <div style="text-align: center;">
                  <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">12 min</div>
                  <div style="font-size: 0.875rem; color: var(--gray-600);">Next Collection</div>
                </div>
                <div style="text-align: center;">
                  <div style="font-size: 1.5rem; font-weight: 700; color: var(--warning);">85%</div>
                  <div style="font-size: 0.875rem; color: var(--gray-600);">Route Complete</div>
                </div>
              </div>
            </div>
          </div>

          <div class="vehicle-list">
            <h4 style="margin-bottom: 1rem;">Nearby Vehicles</h4>
            <div class="vehicles-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
              ${this.renderVehicleCards()}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderVehicleCards() {
    const vehicles = [
      { id: 'GC-001', driver: 'Carlos Garcia', zone: 'Zone A', status: 'active', eta: '12 min', distance: '0.8 km' },
      { id: 'GC-002', driver: 'Maria Lopez', zone: 'Zone B', status: 'active', eta: '25 min', distance: '2.1 km' },
      { id: 'GC-003', driver: 'Ahmed Hassan', zone: 'Zone C', status: 'maintenance', eta: 'N/A', distance: 'N/A' }
    ];

    return vehicles.map(vehicle => `
      <div class="vehicle-card" style="border: 1px solid var(--gray-200); border-radius: 12px; padding: 1.5rem; background: var(--white);">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
          <div>
            <h5 style="margin-bottom: 0.5rem; color: var(--gray-900);">Vehicle ${vehicle.id}</h5>
            <p style="margin: 0; color: var(--gray-600); font-size: 0.875rem;">Driver: ${vehicle.driver}</p>
          </div>
          <span class="badge ${vehicle.status === 'active' ? 'badge-success' : 'badge-warning'}">
            ${vehicle.status === 'active' ? 'Active' : 'Maintenance'}
          </span>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1rem;">
          <div>
            <div style="font-size: 0.75rem; color: var(--gray-500); text-transform: uppercase; margin-bottom: 0.25rem;">Zone</div>
            <div style="font-weight: 600;">${vehicle.zone}</div>
          </div>
          <div>
            <div style="font-size: 0.75rem; color: var(--gray-500); text-transform: uppercase; margin-bottom: 0.25rem;">ETA</div>
            <div style="font-weight: 600; color: ${vehicle.status === 'active' ? 'var(--primary)' : 'var(--gray-400)'};">${vehicle.eta}</div>
          </div>
        </div>
        
        ${vehicle.status === 'active' ? `
          <button class="btn btn-primary" style="width: 100%;" onclick="window.CitizenDashboard.subscribeToVehicle('${vehicle.id}')">
            <i class="fas fa-bell"></i>
            Get Arrival Alerts
          </button>
        ` : `
          <button class="btn btn-ghost" style="width: 100%;" disabled>
            <i class="fas fa-tools"></i>
            Under Maintenance
          </button>
        `}
      </div>
    `).join('');
  }

  renderShop() {
    return `
      <div class="dashboard-header">
        <h1 class="dashboard-title">Eco-Friendly Shop</h1>
        <p class="dashboard-subtitle">Use your Green Points to purchase sustainable products</p>
        <button class="btn btn-primary" onclick="window.EcommerceManager.showCart()">
          <i class="fas fa-shopping-cart"></i>
          Cart <span class="cart-badge" style="background: var(--error); color: white; border-radius: 50%; padding: 0.25rem 0.5rem; font-size: 0.75rem; margin-left: 0.5rem;">0</span>
        </button>
      </div>

      <div class="dashboard-stats" style="margin-bottom: 2rem;">
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">Available Points</span>
            <div class="stat-icon warning">
              <i class="fas fa-coins"></i>
            </div>
          </div>
          <div class="stat-value">${authSystem.getCurrentUser().greenPoints || 0}</div>
          <div class="stat-change positive">
            <i class="fas fa-leaf"></i>
            Eco Currency
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">Orders Placed</span>
            <div class="stat-icon primary">
              <i class="fas fa-box"></i>
            </div>
          </div>
          <div class="stat-value">5</div>
          <div class="stat-change positive">
            <i class="fas fa-arrow-up"></i>
            This month
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">Carbon Saved</span>
            <div class="stat-icon success">
              <i class="fas fa-leaf"></i>
            </div>
          </div>
          <div class="stat-value">2.4kg</div>
          <div class="stat-change positive">
            <i class="fas fa-arrow-up"></i>
            CO₂ reduction
          </div>
        </div>
      </div>

      <div class="shop-categories" style="margin-bottom: 2rem;">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Product Categories</h3>
          </div>
          <div class="card-body">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
              <button class="category-btn" onclick="window.CitizenDashboard.filterProducts('all')" style="padding: 1rem; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer;">
                <i class="fas fa-th" style="font-size: 1.5rem; margin-bottom: 0.5rem; display: block;"></i>
                All Products
              </button>
              <button class="category-btn" onclick="window.CitizenDashboard.filterProducts('containers')" style="padding: 1rem; background: var(--white); color: var(--gray-700); border: 1px solid var(--gray-300); border-radius: 8px; cursor: pointer;">
                <i class="fas fa-box" style="font-size: 1.5rem; margin-bottom: 0.5rem; display: block;"></i>
                Containers
              </button>
              <button class="category-btn" onclick="window.CitizenDashboard.filterProducts('composting')" style="padding: 1rem; background: var(--white); color: var(--gray-700); border: 1px solid var(--gray-300); border-radius: 8px; cursor: pointer;">
                <i class="fas fa-seedling" style="font-size: 1.5rem; margin-bottom: 0.5rem; display: block;"></i>
                Composting
              </button>
              <button class="category-btn" onclick="window.CitizenDashboard.filterProducts('supplies')" style="padding: 1rem; background: var(--white); color: var(--gray-700); border: 1px solid var(--gray-300); border-radius: 8px; cursor: pointer;">
                <i class="fas fa-shopping-bag" style="font-size: 1.5rem; margin-bottom: 0.5rem; display: block;"></i>
                Supplies
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="product-grid">
        ${ECOMMERCE_PRODUCTS.map(product => `
          <div class="product-card">
            <div class="product-image">
              ${product.image}
            </div>
            <div class="product-info">
              <h4 class="product-title">${product.name}</h4>
              <p style="color: var(--gray-600); margin-bottom: 1rem; font-size: 0.875rem;">${product.description}</p>
              <div class="product-price">${Utils.formatCurrency(product.price)}</div>
              <div style="display: flex; gap: 0.5rem;">
                <button class="btn btn-ghost" onclick="modal.showProductDetails(${JSON.stringify(product).replace(/"/g, '&quot;')})" style="flex: 1;">
                  <i class="fas fa-eye"></i>
                  View
                </button>
                <button class="btn btn-primary" onclick="window.EcommerceManager.addToCart(${product.id})" style="flex: 1;">
                  <i class="fas fa-cart-plus"></i>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <div style="margin-top: 2rem;">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Recent Orders</h3>
            <button class="btn btn-secondary" onclick="window.EcommerceManager.showOrderHistory()">
              <i class="fas fa-history"></i>
              View All Orders
            </button>
          </div>
          <div class="card-body">
            <div class="orders-preview">
              <div class="order-item" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; border: 1px solid var(--gray-200); border-radius: 8px; margin-bottom: 1rem;">
                <div>
                  <div style="font-weight: 600; margin-bottom: 0.25rem;">Order #ORD001</div>
                  <div style="font-size: 0.875rem; color: var(--gray-600);">Segregation Dustbin Set + Compost Bin</div>
                </div>
                <div style="text-align: right;">
                  <div style="font-weight: 600; color: var(--primary);">₹1,498</div>
                  <span class="badge badge-success">Delivered</span>
                </div>
              </div>
              
              <div class="order-item" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; border: 1px solid var(--gray-200); border-radius: 8px;">
                <div>
                  <div style="font-weight: 600; margin-bottom: 0.25rem;">Order #ORD002</div>
                  <div style="font-size: 0.875rem; color: var(--gray-600);">Biodegradable Bags (Pack of 100)</div>
                </div>
                <div style="text-align: right;">
                  <div style="font-weight: 600; color: var(--primary);">₹199</div>
                  <span class="badge badge-info">Shipped</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderTraining() {
    const user = authSystem.getCurrentUser();
    const trainingStats = window.TrainingSystem.getTrainingStats(user.id);
    const modules = ENHANCED_TRAINING_MODULES.citizen || [];

    return `
      <div class="dashboard-header">
        <h1 class="dashboard-title">Environmental Training</h1>
        <p class="dashboard-subtitle">Learn, practice, and earn Green Points through interactive lessons</p>
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
            <span class="stat-title">Lives</span>
            <div class="stat-icon error">
              <i class="fas fa-heart"></i>
            </div>
          </div>
          <div class="stat-value">${trainingStats.hearts}</div>
          <div class="stat-change positive">
            <i class="fas fa-shield-alt"></i>
            Remaining
          </div>
        </div>
      </div>

      <div class="training-modules">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Training Modules</h3>
            <div style="display: flex; gap: 1rem;">
              <button class="btn btn-secondary" onclick="window.CitizenDashboard.showLeaderboard()">
                <i class="fas fa-trophy"></i>
                Leaderboard
              </button>
              <button class="btn btn-info" onclick="window.CitizenDashboard.showCertificates()">
                <i class="fas fa-certificate"></i>
                Certificates
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
                      ${isCompleted ? 'Review Module' : 'Start Learning'}
                    </button>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </div>

      ${trainingStats.completedModules > 0 ? `
        <div style="margin-top: 2rem;">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Your Achievements</h3>
            </div>
            <div class="card-body">
              <div class="achievements-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                <div class="achievement-item" style="text-align: center; padding: 1.5rem; background: var(--success); color: white; border-radius: 12px;">
                  <i class="fas fa-medal" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                  <div style="font-weight: 600;">First Module</div>
                  <div style="font-size: 0.875rem; opacity: 0.9;">Completed your first training</div>
                </div>
                
                ${trainingStats.currentStreak >= 3 ? `
                  <div class="achievement-item" style="text-align: center; padding: 1.5rem; background: var(--error); color: white; border-radius: 12px;">
                    <i class="fas fa-fire" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                    <div style="font-weight: 600;">On Fire!</div>
                    <div style="font-size: 0.875rem; opacity: 0.9;">${trainingStats.currentStreak} day streak</div>
                  </div>
                ` : ''}
                
                ${trainingStats.level >= 2 ? `
                  <div class="achievement-item" style="text-align: center; padding: 1.5rem; background: var(--warning); color: white; border-radius: 12px;">
                    <i class="fas fa-star" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                    <div style="font-weight: 600;">Level Up!</div>
                    <div style="font-size: 0.875rem; opacity: 0.9;">Reached level ${trainingStats.level}</div>
                  </div>
                ` : ''}
              </div>
            </div>
          </div>
        </div>
      ` : ''}
    `;
  }

  renderProfile() {
    const user = authSystem.getCurrentUser();
    const trainingStats = window.TrainingSystem.getTrainingStats(user.id);
    
    return `
      <div class="dashboard-header">
        <h1 class="dashboard-title">My Profile</h1>
        <p class="dashboard-subtitle">Manage your account and view your environmental impact</p>
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
              <p style="color: var(--gray-600);">Environmental Citizen</p>
              <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: 1rem;">
                <i class="fas fa-star" style="color: var(--warning);"></i>
                <span style="font-weight: 600;">Level ${trainingStats.level}</span>
              </div>
            </div>
            
            <div class="profile-stats">
              <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--gray-200);">
                <span>Green Points:</span>
                <strong style="color: var(--success);">${user.greenPoints || 0}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--gray-200);">
                <span>Training XP:</span>
                <strong style="color: var(--warning);">${trainingStats.xp}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--gray-200);">
                <span>Current Streak:</span>
                <strong style="color: var(--error);">${trainingStats.currentStreak} days</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>Member Since:</span>
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
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Address</label>
                <textarea class="form-control" rows="3" placeholder="Enter your address"></textarea>
              </div>
              <div class="form-group" style="margin-bottom: 2rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Notification Preferences</label>
                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                  <label style="display: flex; align-items: center; gap: 0.5rem;">
                    <input type="checkbox" checked>
                    <span>Vehicle arrival notifications</span>
                  </label>
                  <label style="display: flex; align-items: center; gap: 0.5rem;">
                    <input type="checkbox" checked>
                    <span>Training reminders</span>
                  </label>
                  <label style="display: flex; align-items: center; gap: 0.5rem;">
                    <input type="checkbox">
                    <span>Community updates</span>
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
            <h3 class="card-title">Environmental Impact</h3>
          </div>
          <div class="card-body">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem;">
              <div class="impact-metric" style="text-align: center; padding: 1.5rem; background: var(--gray-50); border-radius: 12px;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🌱</div>
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--success); margin-bottom: 0.5rem;">45.2kg</div>
                <div style="color: var(--gray-600);">CO₂ Saved</div>
                <div style="font-size: 0.875rem; color: var(--gray-500);">This year</div>
              </div>
              
              <div class="impact-metric" style="text-align: center; padding: 1.5rem; background: var(--gray-50); border-radius: 12px;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">♻️</div>
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary); margin-bottom: 0.5rem;">127kg</div>
                <div style="color: var(--gray-600);">Waste Recycled</div>
                <div style="font-size: 0.875rem; color: var(--gray-500);">This year</div>
              </div>
              
              <div class="impact-metric" style="text-align: center; padding: 1.5rem; background: var(--gray-50); border-radius: 12px;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🏆</div>
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--warning); margin-bottom: 0.5rem;">#12</div>
                <div style="color: var(--gray-600);">Community Rank</div>
                <div style="font-size: 0.875rem; color: var(--gray-500);">Out of 1,247</div>
              </div>
              
              <div class="impact-metric" style="text-align: center; padding: 1.5rem; background: var(--gray-50); border-radius: 12px;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🎯</div>
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--secondary); margin-bottom: 0.5rem;">8</div>
                <div style="color: var(--gray-600);">Issues Reported</div>
                <div style="font-size: 0.875rem; color: var(--gray-500);">All resolved</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Citizen-specific methods
  getCurrentLocation() {
    const locationInput = document.getElementById('complaintLocation');
    const btn = event.target;
    
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Getting Location...';
    btn.disabled = true;
    
    Utils.getCurrentLocation().then(location => {
      locationInput.value = `Lat: ${location.latitude.toFixed(4)}, Lng: ${location.longitude.toFixed(4)}`;
      btn.innerHTML = '<i class="fas fa-check"></i> Location Added';
      btn.style.background = 'var(--success)';
      
      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Use Current Location';
        btn.disabled = false;
        btn.style.background = '';
      }, 2000);
    });
  }

  refreshTracking() {
    notifications.info('Refreshing', 'Updating vehicle locations...');
    setTimeout(() => {
      notifications.success('Updated', 'Vehicle locations refreshed');
    }, 1500);
  }

  enableNotifications() {
    notifications.success('Notifications Enabled', 'You\'ll receive alerts when vehicles are nearby');
  }

  subscribeToVehicle(vehicleId) {
    notifications.success('Subscribed', `You'll receive alerts for vehicle ${vehicleId}`);
  }

  filterProducts(category) {
    // Update category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.style.background = 'var(--white)';
      btn.style.color = 'var(--gray-700)';
      btn.style.border = '1px solid var(--gray-300)';
    });
    
    event.target.style.background = 'var(--primary)';
    event.target.style.color = 'white';
    event.target.style.border = '1px solid var(--primary)';
    
    notifications.info('Filter Applied', `Showing ${category === 'all' ? 'all' : category} products`);
  }

  showLeaderboard() {
    const leaderboard = window.TrainingSystem.getLeaderboard();
    const currentUser = authSystem.getCurrentUser();
    
    const content = `
      <div class="leaderboard">
        <h3 style="text-align: center; margin-bottom: 2rem;">🏆 Training Leaderboard</h3>
        
        <div class="leaderboard-list">
          ${leaderboard.map((entry, index) => `
            <div class="leaderboard-item" style="display: flex; align-items: center; gap: 1rem; padding: 1rem; margin-bottom: 1rem; background: ${entry.userId === currentUser.id ? 'var(--primary-light)' : 'var(--gray-50)'}; border-radius: 8px; border: ${entry.userId === currentUser.id ? '2px solid var(--primary)' : '1px solid var(--gray-200)'};">
              <div class="rank" style="width: 40px; height: 40px; border-radius: 50%; background: ${index < 3 ? 'var(--warning)' : 'var(--gray-300)'}; display: flex; align-items: center; justify-content: center; font-weight: 700; color: ${index < 3 ? 'white' : 'var(--gray-600)'};">
                ${index + 1}
              </div>
              <div style="flex: 1;">
                <div style="font-weight: 600; margin-bottom: 0.25rem;">
                  ${entry.userId === currentUser.id ? 'You' : `User ${entry.userId.slice(-3)}`}
                  ${entry.userId === currentUser.id ? ' 👤' : ''}
                </div>
                <div style="font-size: 0.875rem; color: var(--gray-600);">
                  Level ${entry.level} • ${entry.completedModules} modules completed
                </div>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 1.25rem; font-weight: 700; color: var(--warning);">${entry.xp} XP</div>
                <div style="font-size: 0.75rem; color: var(--gray-500);">${entry.currentStreak} day streak</div>
              </div>
            </div>
          `).join('')}
        </div>
        
        <div style="text-align: center; margin-top: 2rem;">
          <button class="btn btn-primary" onclick="modal.hide()">Close</button>
        </div>
      </div>
    `;

    modal.show('Training Leaderboard', content, { size: '600px' });
  }

  showCertificates() {
    const user = authSystem.getCurrentUser();
    const certificates = window.TrainingSystem.getUserCertificates(user.id);
    
    if (certificates.length === 0) {
      const content = `
        <div style="text-align: center; padding: 2rem;">
          <div style="font-size: 4rem; margin-bottom: 1rem;">🏆</div>
          <h3 style="margin-bottom: 1rem;">No Certificates Yet</h3>
          <p style="color: var(--gray-600); margin-bottom: 2rem;">Complete all training modules to earn your first certificate!</p>
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
        <h3 style="text-align: center; margin-bottom: 2rem;">🏆 My Certificates</h3>
        
        ${certificates.map(cert => `
          <div class="certificate-item" style="border: 1px solid var(--gray-200); border-radius: 12px; padding: 2rem; margin-bottom: 1rem; background: var(--white);">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
              <div>
                <h4 style="margin-bottom: 0.5rem; color: var(--primary);">${cert.title}</h4>
                <p style="color: var(--gray-600); margin: 0;">Issued: ${Utils.formatDate(new Date(cert.issueDate))}</p>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">🏆</div>
                <div style="font-size: 0.875rem; color: var(--gray-500);">ID: ${cert.id}</div>
              </div>
            </div>
            
            <div style="margin-bottom: 1rem;">
              <strong>Completed Modules:</strong>
              <div style="margin-top: 0.5rem;">
                ${cert.modules.map(module => `
                  <span class="badge badge-success" style="margin-right: 0.5rem; margin-bottom: 0.5rem;">${module}</span>
                `).join('')}
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

    modal.show('My Certificates', content, { size: '700px' });
  }

  bindEvents() {
    // Bind complaint form submission
    const complaintForm = document.getElementById('complaintForm');
    if (complaintForm) {
      complaintForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
          title: document.getElementById('complaintTitle').value,
          category: document.getElementById('complaintCategory').value,
          priority: document.getElementById('complaintPriority').value,
          location: document.getElementById('complaintLocation').value,
          description: document.getElementById('complaintDescription').value
        };

        window.ComplaintManager.createComplaint(formData);
        notifications.success('Complaint Submitted', 'Your complaint has been submitted successfully');
        
        // Reset form
        complaintForm.reset();
        
        // Navigate to my complaints
        setTimeout(() => {
          navigation.navigateTo('my-complaints');
        }, 1500);
      });
    }

    // Update cart badge
    if (window.EcommerceManager) {
      window.EcommerceManager.updateCartBadge();
    }
  }

  refresh() {
    this.loadSection(this.currentSection);
  }
}

// Initialize and export
window.CitizenDashboard = new CitizenDashboard();