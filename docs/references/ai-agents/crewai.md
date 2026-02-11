# CrewAI Reference for AppFactory

## Overview

CrewAI enables building teams of AI agents that collaborate to accomplish complex tasks. Each agent has a role, goal, and backstory that guides their behavior.

## Installation

```bash
pip install crewai crewai-tools
```

For TypeScript/JavaScript, use the CrewAI JS SDK:

```bash
npm install crewai
```

## Core Concepts

### Agents

Agents are autonomous units with specific roles:

```python
from crewai import Agent

researcher = Agent(
    role="Senior Research Analyst",
    goal="Uncover cutting-edge developments in AI",
    backstory="""You work at a leading tech think tank.
    Your expertise lies in identifying emerging trends.""",
    verbose=True,
    allow_delegation=False,
    tools=[search_tool, web_scraper]
)

writer = Agent(
    role="Tech Content Strategist",
    goal="Craft compelling content about tech advancements",
    backstory="""You are a renowned Content Strategist,
    known for your insightful articles.""",
    verbose=True,
    allow_delegation=True
)
```

### Tasks

Tasks are specific assignments for agents:

```python
from crewai import Task

research_task = Task(
    description="""Conduct comprehensive research on the latest
    AI developments. Identify key trends and breakthroughs.""",
    expected_output="A detailed report with key findings",
    agent=researcher,
    tools=[search_tool]
)

writing_task = Task(
    description="""Using the research findings, create an
    engaging blog post about AI trends.""",
    expected_output="A 1000-word blog post in markdown",
    agent=writer,
    context=[research_task]  # Depends on research
)
```

### Crews

Crews orchestrate agents and tasks:

```python
from crewai import Crew, Process

crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, writing_task],
    process=Process.sequential,  # or Process.hierarchical
    verbose=True
)

result = crew.kickoff()
```

## Process Types

### Sequential

Tasks execute in order:

```python
crew = Crew(
    agents=[agent1, agent2, agent3],
    tasks=[task1, task2, task3],
    process=Process.sequential
)
# task1 → task2 → task3
```

### Hierarchical

A manager agent coordinates:

```python
from crewai import Crew, Process
from langchain_anthropic import ChatAnthropic

crew = Crew(
    agents=[researcher, writer, editor],
    tasks=[research_task, writing_task, editing_task],
    process=Process.hierarchical,
    manager_llm=ChatAnthropic(model="claude-sonnet-4-5-20250514")
)
```

## Tools

### Built-in Tools

```python
from crewai_tools import (
    SerperDevTool,      # Web search
    WebsiteSearchTool,  # Search specific website
    FileReadTool,       # Read files
    DirectoryReadTool,  # List directory
    CodeInterpreterTool # Execute code
)

search_tool = SerperDevTool()
file_tool = FileReadTool()
```

### Custom Tools

```python
from crewai_tools import BaseTool
from pydantic import Field

class MyCustomTool(BaseTool):
    name: str = "Custom Tool"
    description: str = "Does something useful"

    def _run(self, argument: str) -> str:
        # Tool logic
        return f"Result for {argument}"
```

## Agent Configuration

### Memory

Enable agent memory:

```python
agent = Agent(
    role="Analyst",
    goal="Analyze data patterns",
    backstory="...",
    memory=True,  # Enable memory
    verbose=True
)
```

### Delegation

Allow agents to delegate tasks:

```python
manager = Agent(
    role="Project Manager",
    goal="Coordinate team efforts",
    backstory="...",
    allow_delegation=True  # Can assign to other agents
)

worker = Agent(
    role="Developer",
    goal="Write code",
    backstory="...",
    allow_delegation=False  # Does own work
)
```

### LLM Selection

Use specific models:

```python
from langchain_anthropic import ChatAnthropic

agent = Agent(
    role="Expert",
    goal="...",
    backstory="...",
    llm=ChatAnthropic(model="claude-sonnet-4-5-20250514")
)
```

## Task Configuration

### Context Sharing

Pass output between tasks:

```python
task1 = Task(
    description="Research the topic",
    expected_output="Research report",
    agent=researcher
)

task2 = Task(
    description="Write article based on research",
    expected_output="Article",
    agent=writer,
    context=[task1]  # Receives task1 output
)
```

### Callbacks

React to task completion:

```python
def task_callback(output):
    print(f"Task completed: {output}")

task = Task(
    description="...",
    expected_output="...",
    agent=agent,
    callback=task_callback
)
```

### Async Execution

```python
task = Task(
    description="...",
    expected_output="...",
    agent=agent,
    async_execution=True
)
```

## Crew Patterns

### Research Team

```python
researcher = Agent(
    role="Research Specialist",
    goal="Find accurate information",
    backstory="Expert at finding and validating information"
)

analyst = Agent(
    role="Data Analyst",
    goal="Analyze and interpret data",
    backstory="Expert at finding patterns in data"
)

writer = Agent(
    role="Report Writer",
    goal="Create clear, comprehensive reports",
    backstory="Expert at translating findings into readable reports"
)

crew = Crew(
    agents=[researcher, analyst, writer],
    tasks=[research_task, analysis_task, report_task],
    process=Process.sequential
)
```

### Development Team

```python
architect = Agent(
    role="Software Architect",
    goal="Design system architecture",
    backstory="20 years of software architecture experience"
)

developer = Agent(
    role="Senior Developer",
    goal="Implement features",
    backstory="Expert in modern web development"
)

tester = Agent(
    role="QA Engineer",
    goal="Ensure code quality",
    backstory="Expert at finding edge cases and bugs"
)
```

## Best Practices

1. **Clear roles** - Each agent should have distinct responsibilities
2. **Specific goals** - Goals should be measurable
3. **Rich backstories** - Help agents stay in character
4. **Appropriate tools** - Give agents only needed tools
5. **Task dependencies** - Use context for ordered tasks
6. **Memory for context** - Enable memory for multi-step tasks

## Error Handling

```python
from crewai import Crew

crew = Crew(
    agents=[...],
    tasks=[...],
    max_rpm=10,  # Rate limit
    max_iterations=15,  # Prevent infinite loops
    verbose=True
)

try:
    result = crew.kickoff()
except Exception as e:
    print(f"Crew failed: {e}")
```

## Integration with Claude

```python
from langchain_anthropic import ChatAnthropic

claude = ChatAnthropic(
    model="claude-sonnet-4-5-20250514",
    temperature=0.7
)

agent = Agent(
    role="Expert",
    goal="Provide expert analysis",
    backstory="...",
    llm=claude,
    verbose=True
)
```

## Resources

- [CrewAI Documentation](https://docs.crewai.com/)
- [CrewAI GitHub](https://github.com/joaomdmoura/crewAI)
- [CrewAI Tools](https://github.com/joaomdmoura/crewAI-tools)
