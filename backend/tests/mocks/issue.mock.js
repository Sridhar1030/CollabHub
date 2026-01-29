// Mock data for Issue tests
const mockIssue = {
    _id: "507f1f77bcf86cd799439011",
    username: "testuser",
    repository: "testrepo",
    title: "Test Issue",
    description: "This is a test issue description",
    status: "open",
    priority: "medium",
    assignees: [{ name: "John Doe", email: "john@example.com" }],
    createdBy: {
        name: "Jane Doe",
        email: "jane@example.com",
    },
    labels: ["bug", "urgent"],
    comments: [],
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
};

const mockIssueWithComments = {
    ...mockIssue,
    comments: [
        {
            author: { name: "John Doe", email: "john@example.com" },
            text: "This is a comment",
            createdAt: new Date("2025-01-02"),
        },
    ],
};

const mockIssuesList = [
    mockIssue,
    {
        ...mockIssue,
        _id: "507f1f77bcf86cd799439012",
        title: "Second Test Issue",
        status: "in-progress",
        priority: "high",
    },
    {
        ...mockIssue,
        _id: "507f1f77bcf86cd799439013",
        title: "Third Test Issue",
        status: "closed",
        priority: "low",
    },
];

const mockIssueStats = {
    byStatus: [
        { _id: "open", count: 5 },
        { _id: "in-progress", count: 3 },
        { _id: "closed", count: 10 },
    ],
    byPriority: [
        { _id: "low", count: 4 },
        { _id: "medium", count: 8 },
        { _id: "high", count: 5 },
        { _id: "critical", count: 1 },
    ],
};

module.exports = {
    mockIssue,
    mockIssueWithComments,
    mockIssuesList,
    mockIssueStats,
};
