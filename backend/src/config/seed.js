const mongoose = require('mongoose');
const User = require('../models/User');
const Asset = require('../models/Asset');
const Issue = require('../models/Issue');
const MaintenanceHistory = require('../models/MaintenanceHistory');

const seedDatabase = async () => {
  try {
    // Check if seeding is already done
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('[Seed] Database already seeded. Skipping.');
      return;
    }

    console.log('[Seed] Starting database seeding...');

    // 1. Create Users
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@maintainiq.com',
      password: 'password123',
      role: 'Admin',
      status: 'Active'
    });

    const technician = await User.create({
      name: 'Tech Specialist',
      email: 'tech@maintainiq.com',
      password: 'password123',
      role: 'Technician',
      status: 'Active'
    });

    console.log('[Seed] Created default users: admin@maintainiq.com / tech@maintainiq.com');

    // 2. Create Assets
    const hvac = await Asset.create({
      assetCode: 'HVAC-01',
      name: 'Main Building Chillers',
      category: 'HVAC',
      location: 'Rooftop Sector B',
      condition: 'Good',
      status: 'Operational',
      description: 'Primary cooling unit for the administrative wing. Uses R-134a refrigerant.',
      createdBy: admin._id,
      assignedTechnician: technician._id
    });

    const generator = await Asset.create({
      assetCode: 'GEN-02',
      name: 'Backup Generator 500kW',
      category: 'Electrical',
      location: 'Basement Room 4',
      condition: 'Excellent',
      status: 'Operational',
      description: 'Emergency diesel generator. Auto-starts on grid power loss.',
      createdBy: admin._id,
      assignedTechnician: technician._id
    });

    const pump = await Asset.create({
      assetCode: 'PUMP-03',
      name: 'Centrifugal Water Pump',
      category: 'Plumbing',
      location: 'Utility Closet C',
      condition: 'Fair',
      status: 'Under Maintenance',
      description: 'Water booster pump for secondary loop pressure control.',
      createdBy: admin._id,
      assignedTechnician: technician._id
    });

    console.log('[Seed] Created default assets.');

    // 3. Create Issues / Work Orders
    const issue1 = await Issue.create({
      asset: pump._id,
      reporterName: 'John Doe',
      reporterEmail: 'john@example.com',
      reporterPhone: '555-0199',
      title: 'Water pump pressure dropping',
      description: 'Pressure gauge drops below 30 PSI intermittently. High vibration noise heard.',
      priority: 'High',
      category: 'Plumbing',
      status: 'Inspection Started',
      assignedTechnician: technician._id
    });

    const issue2 = await Issue.create({
      asset: hvac._id,
      reporterName: 'Sarah Connor',
      reporterEmail: 'sarah@example.com',
      reporterPhone: '555-0244',
      title: 'Thermostat communication error',
      description: 'Chiller thermostat keeps showing connection offline. Needs replacement or wiring check.',
      priority: 'Medium',
      category: 'HVAC',
      status: 'Reported',
      assignedTechnician: null
    });

    console.log('[Seed] Created default issues.');

    // 4. Create Maintenance History Logs
    const now = new Date();
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);

    await MaintenanceHistory.create({
      asset: hvac._id,
      actor: technician._id,
      action: 'Asset Created',
      description: 'HVAC-01 asset registered in MaintainIQ database.',
      date: fiveDaysAgo
    });

    await MaintenanceHistory.create({
      asset: generator._id,
      actor: admin._id,
      action: 'Asset Created',
      description: 'Backup Generator registered and QR code generated.',
      date: fiveDaysAgo
    });

    // Create a resolved issue to get spend & downtime data in Reports
    const solvedIssue = new Issue({
      asset: hvac._id,
      reporterName: 'System Monitor',
      reporterEmail: 'monitor@maintainiq.com',
      title: 'HVAC Filter Replacements',
      description: 'Semi-annual air intake filter swap and cleaning.',
      priority: 'Low',
      category: 'HVAC',
      status: 'Resolved',
      assignedTechnician: technician._id,
      maintenanceCost: 350,
      maintenanceNotes: 'Replaced primary air filter elements. Cleaned exhaust vents. Airflow rate restored to nominal.',
      partsUsed: ['Chiller Filter Pack X2', 'V-Belt 40 inches'],
      resolvedDate: twoDaysAgo
    });
    
    // Bypass issue number pre-save save check restriction that triggers validation
    await solvedIssue.save();

    await MaintenanceHistory.create({
      asset: hvac._id,
      issue: solvedIssue._id,
      actor: technician._id,
      action: 'Maintenance Completed',
      description: 'Routine maintenance: Replaced primary air filter elements. Cleaned exhaust vents.',
      date: twoDaysAgo
    });

    console.log('[Seed] Created default maintenance history logs.');
    console.log('[Seed] Database seeding completed successfully!');
  } catch (err) {
    console.error('[Seed Error] Seeding database failed:', err);
  }
};

module.exports = seedDatabase;
