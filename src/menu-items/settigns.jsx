
const settings_menu = {
    items: [
        {
            title: 'User Management ',
            children: [
                {
                    title: 'Users',
                    url: '.',
                }, {
                    title: 'Country Office',
                    url: 'office',
                },  {
                    title: 'Roles',
                    url: 'roles',
                }
            ]
        },
        {
            title: 'Fields',
            children: [
                {
                    title: 'Categories',
                    url: 'category',
                }, {
                    title: 'Projects',
                    url: '.',
                }, {
                    title: 'Custom Fields',
                    url: '.',
                }
            ]
        },{
            title: 'POLICIES',
            children: [
                {
                    title: 'Approval flow',
                    url: '.',
                }, {
                    title: 'Expense rules',
                    url: 'expense_rules',
                }, {
                    title: 'Reject Reasons',
                    url: '.',
                }
            ]
        },
    ]
};

const settings_menu_in_app = {
    items: [
        {
            title: 'User Management ',
            children: [
                {
                    title: 'Users',
                    url: './settings',
                }, {
                    title: 'Country Office',
                    url: './settings/office',
                },  {
                    title: 'Roles',
                    url: './settings/roles',
                }
            ]
        },
        {
            title: 'Fields',
            children: [
                {
                    title: 'Categories',
                    url: './settings/category',
                }, {
                    title: 'Projects',
                    url: './settings/blank',
                }, {
                    title: 'Custom Fields',
                    url: './settings/blank',
                }
            ]
        },{
            title: 'POLICIES',
            children: [
                {
                    title: 'Approval flow',
                    url: './settings/blank',
                }, {
                    title: 'Expense rules',
                    url: './settings/expense_rules',
                }, {
                    title: 'Reject Reasons',
                    url: './settings/blank',
                }
            ]
        },
    ]
};

export default settings_menu
export {
    settings_menu_in_app
}