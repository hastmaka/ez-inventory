import PropTypes from "prop-types";
import {Anchor, Stack, Text} from "@mantine/core";
import classes from './TextGenerator.module.scss';
import EzText from "@/ezMantine/text/EzText.jsx";

const renderImportant = ({important}) => {
    if(Array.isArray(important)) {
        return <Stack>
            <EzText>Important</EzText>
            {important.map((item, index) =>
                <Text key={index} size='12px' pl='1rem'>{item}</Text>
            )}
        </Stack>
    }
    return <EzText>{important}</EzText>
}

const renderText = ({text}) => {
    if(Array.isArray(text)) {
        return (
            <Stack
                component='ul'
                p='.2rem 1rem'
            >
                {text.map((item, index) => {
                    return (
                        <EzText
                            className={classes.text}
                            component='li'
                            key={index}
                        >{item}</EzText>
                    )
                })}
            </Stack>
        )
    } else {
        return <Text className={classes.text} pl='1rem' ta='justify'>{text}</Text>
    }
}

const renderMedia = ({link}) => {
    if(Array.isArray(link)) {
        return (
            <Stack
                component='ul'
                p='.2rem 1rem'
            >
                {link.map(({label, href}, index) => {
                    return (
                        <li key={index} style={{listStyle: 'none'}}>
                            <Anchor
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                size='sm'
                            >
                                {label}
                            </Anchor>
                        </li>
                    )
                })}
            </Stack>
        )
    } else {
        return (
            <Anchor
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                size='sm'
            >
                {link.label}
            </Anchor>
        )
    }
}

const join = () => {
    return null /*<span style={{color: 'red', padding: '1rem 0'}}>this</span>*/
}

export default function TextGenerator({item, isLast}) {
    const {header, enunciate, text, link, important} = item;

    return (
        <Stack>
            {important && renderImportant({important})}
            {header && <Text className={classes.header}>{header}</Text>}
            {enunciate && <Text className={classes.enunciate}>{enunciate}</Text>}
            {link && (
                <>
                    {renderMedia({link})}
                    {!isLast && join()}
                </>
            )}
            {text && (
                <>
                    {renderText({text})}
                    {!isLast && join()}
                </>
            )}
        </Stack>
    );
}

TextGenerator.propTypes = {
    item: PropTypes.object.isRequired,
    isLast: PropTypes.bool.isRequired,
}

// <Anchor href='https://www.ryl.vegas' target="_blank" rel="noopener noreferrer" size='sm'>
//     RY&L
// </Anchor>

// {
//     "article_id": 2,
//     "article_status": "draft",
//     "article_title": "10 Tips for Boosting Your Productivity",
//     "article_author": "Jane Doe",
//     "article_date": "2024-12-24",
//     "article_summary": "A comprehensive guide to boosting your productivity through proven techniques and tools. Learn how to organize your time, set meaningful goals, and develop habits that lead to success.",
//     "article_tags": [
//     "remote work",
//     "business",
//     "technology"
// ],
//     "article_url": [
//     "https://plus.unsplash.com/premium_photo-1681426687411-21986b0626a8?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
// ],
//     "article_description": [
//     {
//         "header": [
//             "Master the Art of Productivity"
//         ]
//     },
//     {
//         "enunciate": [
//             "Time Blocking: Optimize Your Daily Workflow"
//         ]
//     },
//     {
//         "text": [
//             "Time blocking is a simple yet effective technique to allocate specific hours for tasks. It helps you maintain focus and avoid distractions. Use tools like Google Calendar or Notion to create a visual plan of your day. Start with your most important tasks during peak energy hours, and reserve less demanding activities for later."
//         ]
//     },
//     {
//         "enunciate": [
//             "Set Clear, Measurable Goals"
//         ]
//     },
//     {
//         "text": [
//             "Define SMART goals: Specific, Measurable, Achievable, Relevant, and Time-bound.",
//             "Break down large objectives into smaller, manageable tasks to stay motivated and track progress.",
//             "Reflect on your goals weekly to ensure alignment with long-term aspirations."
//         ]
//     },
//     {
//         "enunciate": [
//             "Prioritize with the Eisenhower Matrix"
//         ]
//     },
//     {
//         "text": [
//             "Categorize tasks into four quadrants: urgent and important, not urgent but important, urgent but not important, and neither urgent nor important.",
//             "Focus your energy on tasks in the first two quadrants and delegate or eliminate the rest."
//         ]
//     },
//     {
//         "enunciate": [
//             "The Power of Breaks: Recharge Your Mind"
//         ]
//     },
//     {
//         "text": [
//             "Incorporate short breaks into your schedule using the Pomodoro Technique—25 minutes of work followed by a 5-minute break.",
//             "Engage in activities like stretching, walking, or meditation during breaks to refresh your mind.",
//             "Avoid digital distractions during breaks to ensure mental relaxation."
//         ]
//     },
//     {
//         "link": [
//             {
//                 "href": "https://ryl.vegas",
//                 "label": "Download our productivity tools guide"
//             },
//             {
//                 "href": "https://ryl.vegas",
//                 "label": "Download our productivity tools guide 2"
//             }
//         ]
//     },
//     {
//         "enunciate": [
//             "Create a Distraction-Free Environment"
//         ]
//     },
//     {
//         "text": [
//             "Declutter your workspace by removing unnecessary items and keeping only essential tools.",
//             "Invest in ergonomic furniture and proper lighting to enhance comfort and reduce fatigue.",
//             "Use noise-canceling headphones or background music apps to block out distractions."
//         ]
//     },
//     {
//         "enunciate": [
//             "Leverage Technology: Work Smarter, Not Harder"
//         ]
//     },
//     {
//         "text": [
//             "Automate repetitive tasks using tools like Zapier or IFTTT to save time.",
//             "Track your time and productivity using apps like RescueTime or Toggl.",
//             "Use collaboration platforms like Trello, Asana, or Slack to streamline teamwork and communication."
//         ]
//     },
//     {
//         "enunciate": [
//             "Learn to Say No: Guard Your Time"
//         ]
//     },
//     {
//         "text": [
//             "Politely decline commitments that don’t align with your priorities or add value to your life.",
//             "Communicate boundaries effectively with colleagues, friends, and family to avoid over-commitment."
//         ]
//     },
//     {
//         "enunciate": [
//             "Practice Self-Care to Sustain Productivity"
//         ]
//     },
//     {
//         "text": [
//             "Adopt healthy habits like regular exercise, balanced nutrition, and sufficient sleep to maintain physical and mental energy.",
//             "Schedule downtime to relax and recharge, preventing burnout and enhancing overall well-being."
//         ]
//     },
//     {
//         "enunciate": [
//             "Track Your Progress and Celebrate Wins"
//         ]
//     },
//     {
//         "text": [
//             "Review your daily and weekly achievements to identify areas for improvement.",
//             "Celebrate milestones, no matter how small, to stay motivated and maintain a positive mindset."
//         ]
//     },
//     {
//         "important": [
//             "Productivity is not about doing more but achieving more of what truly matters. Consistency and balance are the keys to lasting success."
//         ]
//     }
// ]
// },
// {
//     "article_id": 3,
//     "article_status": "active",
//     "article_title": "10 Tips for Boosting Your Productivity",
//     "article_author": "Jane Doe",
//     "article_date": "2024-12-24",
//     "article_summary": "A comprehensive guide to boosting your productivity through proven techniques and tools. Learn how to organize your time, set meaningful goals, and develop habits that lead to success.",
//     "article_tags": [
//     "health",
//     "wellness",
//     "lifestyle"
// ],
//     "article_url": [
//     "https://plus.unsplash.com/premium_photo-1681426687411-21986b0626a8?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
// ],
//     "article_description": [
//     {
//         "header": [
//             "Master the Art of Productivity"
//         ]
//     },
//     {
//         "enunciate": [
//             "Time Blocking: Optimize Your Daily Workflow"
//         ]
//     },
//     {
//         "text": [
//             "Time blocking is a simple yet effective technique to allocate specific hours for tasks. It helps you maintain focus and avoid distractions. Use tools like Google Calendar or Notion to create a visual plan of your day. Start with your most important tasks during peak energy hours, and reserve less demanding activities for later."
//         ]
//     },
//     {
//         "enunciate": [
//             "Set Clear, Measurable Goals"
//         ]
//     },
//     {
//         "text": [
//             "Define SMART goals: Specific, Measurable, Achievable, Relevant, and Time-bound.",
//             "Break down large objectives into smaller, manageable tasks to stay motivated and track progress.",
//             "Reflect on your goals weekly to ensure alignment with long-term aspirations."
//         ]
//     },
//     {
//         "enunciate": [
//             "Prioritize with the Eisenhower Matrix"
//         ]
//     },
//     {
//         "text": [
//             "Categorize tasks into four quadrants: urgent and important, not urgent but important, urgent but not important, and neither urgent nor important.",
//             "Focus your energy on tasks in the first two quadrants and delegate or eliminate the rest."
//         ]
//     },
//     {
//         "enunciate": [
//             "The Power of Breaks: Recharge Your Mind"
//         ]
//     },
//     {
//         "text": [
//             "Incorporate short breaks into your schedule using the Pomodoro Technique—25 minutes of work followed by a 5-minute break.",
//             "Engage in activities like stretching, walking, or meditation during breaks to refresh your mind.",
//             "Avoid digital distractions during breaks to ensure mental relaxation."
//         ]
//     },
//     {
//         "link": [
//             {
//                 "href": "https://ryl.vegas",
//                 "label": "Download our productivity tools guide"
//             },
//             {
//                 "href": "https://ryl.vegas",
//                 "label": "Download our productivity tools guide 2"
//             }
//         ]
//     },
//     {
//         "enunciate": [
//             "Create a Distraction-Free Environment"
//         ]
//     },
//     {
//         "text": [
//             "Declutter your workspace by removing unnecessary items and keeping only essential tools.",
//             "Invest in ergonomic furniture and proper lighting to enhance comfort and reduce fatigue.",
//             "Use noise-canceling headphones or background music apps to block out distractions."
//         ]
//     },
//     {
//         "enunciate": [
//             "Leverage Technology: Work Smarter, Not Harder"
//         ]
//     },
//     {
//         "text": [
//             "Automate repetitive tasks using tools like Zapier or IFTTT to save time.",
//             "Track your time and productivity using apps like RescueTime or Toggl.",
//             "Use collaboration platforms like Trello, Asana, or Slack to streamline teamwork and communication."
//         ]
//     },
//     {
//         "enunciate": [
//             "Learn to Say No: Guard Your Time"
//         ]
//     },
//     {
//         "text": [
//             "Politely decline commitments that don’t align with your priorities or add value to your life.",
//             "Communicate boundaries effectively with colleagues, friends, and family to avoid over-commitment."
//         ]
//     },
//     {
//         "enunciate": [
//             "Practice Self-Care to Sustain Productivity"
//         ]
//     },
//     {
//         "text": [
//             "Adopt healthy habits like regular exercise, balanced nutrition, and sufficient sleep to maintain physical and mental energy.",
//             "Schedule downtime to relax and recharge, preventing burnout and enhancing overall well-being."
//         ]
//     },
//     {
//         "enunciate": [
//             "Track Your Progress and Celebrate Wins"
//         ]
//     },
//     {
//         "text": [
//             "Review your daily and weekly achievements to identify areas for improvement.",
//             "Celebrate milestones, no matter how small, to stay motivated and maintain a positive mindset."
//         ]
//     },
//     {
//         "important": [
//             "Productivity is not about doing more but achieving more of what truly matters. Consistency and balance are the keys to lasting success."
//         ]
//     }
// ]
// },
// {
//     "article_id": 4,
//     "article_status": "active",
//     "article_title": "10 Tips for Boosting Your Productivity",
//     "article_author": "Jane Doe",
//     "article_date": "2024-12-24",
//     "article_summary": "A comprehensive guide to boosting your productivity through proven techniques and tools. Learn how to organize your time, set meaningful goals, and develop habits that lead to success.",
//     "article_tags": [
//     "digital marketing",
//     "business",
//     "strategy"
// ],
//     "article_url": [
//     "https://plus.unsplash.com/premium_photo-1681426687411-21986b0626a8?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
// ],
//     "article_description": [
//     {
//         "header": [
//             "Master the Art of Productivity"
//         ]
//     },
//     {
//         "enunciate": [
//             "Time Blocking: Optimize Your Daily Workflow"
//         ]
//     },
//     {
//         "text": [
//             "Time blocking is a simple yet effective technique to allocate specific hours for tasks. It helps you maintain focus and avoid distractions. Use tools like Google Calendar or Notion to create a visual plan of your day. Start with your most important tasks during peak energy hours, and reserve less demanding activities for later."
//         ]
//     },
//     {
//         "enunciate": [
//             "Set Clear, Measurable Goals"
//         ]
//     },
//     {
//         "text": [
//             "Define SMART goals: Specific, Measurable, Achievable, Relevant, and Time-bound.",
//             "Break down large objectives into smaller, manageable tasks to stay motivated and track progress.",
//             "Reflect on your goals weekly to ensure alignment with long-term aspirations."
//         ]
//     },
//     {
//         "enunciate": [
//             "Prioritize with the Eisenhower Matrix"
//         ]
//     },
//     {
//         "text": [
//             "Categorize tasks into four quadrants: urgent and important, not urgent but important, urgent but not important, and neither urgent nor important.",
//             "Focus your energy on tasks in the first two quadrants and delegate or eliminate the rest."
//         ]
//     },
//     {
//         "enunciate": [
//             "The Power of Breaks: Recharge Your Mind"
//         ]
//     },
//     {
//         "text": [
//             "Incorporate short breaks into your schedule using the Pomodoro Technique—25 minutes of work followed by a 5-minute break.",
//             "Engage in activities like stretching, walking, or meditation during breaks to refresh your mind.",
//             "Avoid digital distractions during breaks to ensure mental relaxation."
//         ]
//     },
//     {
//         "link": [
//             {
//                 "href": "https://ryl.vegas",
//                 "label": "Download our productivity tools guide"
//             },
//             {
//                 "href": "https://ryl.vegas",
//                 "label": "Download our productivity tools guide 2"
//             }
//         ]
//     },
//     {
//         "enunciate": [
//             "Create a Distraction-Free Environment"
//         ]
//     },
//     {
//         "text": [
//             "Declutter your workspace by removing unnecessary items and keeping only essential tools.",
//             "Invest in ergonomic furniture and proper lighting to enhance comfort and reduce fatigue.",
//             "Use noise-canceling headphones or background music apps to block out distractions."
//         ]
//     },
//     {
//         "enunciate": [
//             "Leverage Technology: Work Smarter, Not Harder"
//         ]
//     },
//     {
//         "text": [
//             "Automate repetitive tasks using tools like Zapier or IFTTT to save time.",
//             "Track your time and productivity using apps like RescueTime or Toggl.",
//             "Use collaboration platforms like Trello, Asana, or Slack to streamline teamwork and communication."
//         ]
//     },
//     {
//         "enunciate": [
//             "Learn to Say No: Guard Your Time"
//         ]
//     },
//     {
//         "text": [
//             "Politely decline commitments that don’t align with your priorities or add value to your life.",
//             "Communicate boundaries effectively with colleagues, friends, and family to avoid over-commitment."
//         ]
//     },
//     {
//         "enunciate": [
//             "Practice Self-Care to Sustain Productivity"
//         ]
//     },
//     {
//         "text": [
//             "Adopt healthy habits like regular exercise, balanced nutrition, and sufficient sleep to maintain physical and mental energy.",
//             "Schedule downtime to relax and recharge, preventing burnout and enhancing overall well-being."
//         ]
//     },
//     {
//         "enunciate": [
//             "Track Your Progress and Celebrate Wins"
//         ]
//     },
//     {
//         "text": [
//             "Review your daily and weekly achievements to identify areas for improvement.",
//             "Celebrate milestones, no matter how small, to stay motivated and maintain a positive mindset."
//         ]
//     },
//     {
//         "important": [
//             "Productivity is not about doing more but achieving more of what truly matters. Consistency and balance are the keys to lasting success."
//         ]
//     }
// ]
// },
// {
//     "article_id": 5,
//     "article_status": "active",
//     "article_title": "10 Tips for Boosting Your Productivity",
//     "article_author": "Jane Doe",
//     "article_date": "2024-12-24",
//     "article_summary": "A comprehensive guide to boosting your productivity through proven techniques and tools. Learn how to organize your time, set meaningful goals, and develop habits that lead to success.",
//     "article_tags": [
//     "social media",
//     "branding",
//     "marketing"
// ],
//     "article_url": [
//     "https://plus.unsplash.com/premium_photo-1681426687411-21986b0626a8?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
// ],
//     "article_description": [
//     {
//         "header": [
//             "Master the Art of Productivity"
//         ]
//     },
//     {
//         "enunciate": [
//             "Time Blocking: Optimize Your Daily Workflow"
//         ]
//     },
//     {
//         "text": [
//             "Time blocking is a simple yet effective technique to allocate specific hours for tasks. It helps you maintain focus and avoid distractions. Use tools like Google Calendar or Notion to create a visual plan of your day. Start with your most important tasks during peak energy hours, and reserve less demanding activities for later."
//         ]
//     },
//     {
//         "enunciate": [
//             "Set Clear, Measurable Goals"
//         ]
//     },
//     {
//         "text": [
//             "Define SMART goals: Specific, Measurable, Achievable, Relevant, and Time-bound.",
//             "Break down large objectives into smaller, manageable tasks to stay motivated and track progress.",
//             "Reflect on your goals weekly to ensure alignment with long-term aspirations."
//         ]
//     },
//     {
//         "enunciate": [
//             "Prioritize with the Eisenhower Matrix"
//         ]
//     },
//     {
//         "text": [
//             "Categorize tasks into four quadrants: urgent and important, not urgent but important, urgent but not important, and neither urgent nor important.",
//             "Focus your energy on tasks in the first two quadrants and delegate or eliminate the rest."
//         ]
//     },
//     {
//         "enunciate": [
//             "The Power of Breaks: Recharge Your Mind"
//         ]
//     },
//     {
//         "text": [
//             "Incorporate short breaks into your schedule using the Pomodoro Technique—25 minutes of work followed by a 5-minute break.",
//             "Engage in activities like stretching, walking, or meditation during breaks to refresh your mind.",
//             "Avoid digital distractions during breaks to ensure mental relaxation."
//         ]
//     },
//     {
//         "link": [
//             {
//                 "href": "https://ryl.vegas",
//                 "label": "Download our productivity tools guide"
//             },
//             {
//                 "href": "https://ryl.vegas",
//                 "label": "Download our productivity tools guide 2"
//             }
//         ]
//     },
//     {
//         "enunciate": [
//             "Create a Distraction-Free Environment"
//         ]
//     },
//     {
//         "text": [
//             "Declutter your workspace by removing unnecessary items and keeping only essential tools.",
//             "Invest in ergonomic furniture and proper lighting to enhance comfort and reduce fatigue.",
//             "Use noise-canceling headphones or background music apps to block out distractions."
//         ]
//     },
//     {
//         "enunciate": [
//             "Leverage Technology: Work Smarter, Not Harder"
//         ]
//     },
//     {
//         "text": [
//             "Automate repetitive tasks using tools like Zapier or IFTTT to save time.",
//             "Track your time and productivity using apps like RescueTime or Toggl.",
//             "Use collaboration platforms like Trello, Asana, or Slack to streamline teamwork and communication."
//         ]
//     },
//     {
//         "enunciate": [
//             "Learn to Say No: Guard Your Time"
//         ]
//     },
//     {
//         "text": [
//             "Politely decline commitments that don’t align with your priorities or add value to your life.",
//             "Communicate boundaries effectively with colleagues, friends, and family to avoid over-commitment."
//         ]
//     },
//     {
//         "enunciate": [
//             "Practice Self-Care to Sustain Productivity"
//         ]
//     },
//     {
//         "text": [
//             "Adopt healthy habits like regular exercise, balanced nutrition, and sufficient sleep to maintain physical and mental energy.",
//             "Schedule downtime to relax and recharge, preventing burnout and enhancing overall well-being."
//         ]
//     },
//     {
//         "enunciate": [
//             "Track Your Progress and Celebrate Wins"
//         ]
//     },
//     {
//         "text": [
//             "Review your daily and weekly achievements to identify areas for improvement.",
//             "Celebrate milestones, no matter how small, to stay motivated and maintain a positive mindset."
//         ]
//     },
//     {
//         "important": [
//             "Productivity is not about doing more but achieving more of what truly matters. Consistency and balance are the keys to lasting success."
//         ]
//     }
// ]
// },
// {
//     "article_id": 6,
//     "article_title": "test",
//     "article_author": "luis",
//     "article_tags": [
//     "health",
//     "wellness"
// ],
//     "article_summary": "summary",
//     "article_url": [
//     "https://www.itsolutions247.com/blog/boost-customer-loyalty-with-technology/"
// ],
//     "article_description": [
//     {
//         "header": [
//             "test"
//         ]
//     },
//     {
//         "enunciate": [
//             "anunciate"
//         ]
//     },
//     {
//         "link": [
//             {
//                 "href": "https://www.ryl.vegas",
//                 "label": "ryl.vegas we site"
//             }
//         ]
//     },
//     {
//         "important": [
//             "thi is important"
//         ]
//     }
// ],
//     "article_date": "2024-12-30",
//     "article_status": "draft"
// }