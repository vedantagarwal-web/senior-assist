/**
 * Multi-Agent Orchestrator
 * Coordinates multiple OpenClaw agents for complex tasks
 */

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

class AgentOrchestrator {
  constructor() {
    this.activeAgents = new Map();
  }

  /**
   * Spawn specialized sub-agents for complex workflows
   */
  async orchestrateComplexOrder(userPhone, orderRequest) {
    console.log(`🎭 Orchestrating complex order for ${userPhone}...`);
    
    const agents = [];
    
    try {
      // Agent 1: Restaurant Finder (searches for restaurants based on criteria)
      const finderAgent = await this.spawnAgent('restaurant-finder', {
        task: `Find restaurants matching these criteria: ${JSON.stringify(orderRequest.criteria)}. Return top 3 options with reasons.`,
        model: 'sonnet'
      });
      agents.push(finderAgent);
      
      // Agent 2: Menu Analyzer (analyzes menu items for dietary restrictions)
      if (orderRequest.dietaryRestrictions) {
        const menuAgent = await this.spawnAgent('menu-analyzer', {
          task: `Analyze menu for dietary restrictions: ${orderRequest.dietaryRestrictions}. Suggest safe options.`,
          model: 'sonnet'
        });
        agents.push(menuAgent);
      }
      
      // Agent 3: Price Optimizer (finds best deals and estimates total cost)
      const priceAgent = await this.spawnAgent('price-optimizer', {
        task: `Find the best value for this order. Consider delivery fees, discounts, and portion sizes.`,
        model: 'sonnet'
      });
      agents.push(priceAgent);
      
      // Wait for all agents to complete
      const results = await Promise.all(
        agents.map(agent => this.getAgentResult(agent.sessionKey))
      );
      
      // Synthesize results
      const synthesis = await this.synthesizeResults(results);
      
      console.log(`✅ Orchestration complete:`, synthesis);
      
      // Clean up agents
      await this.cleanupAgents(agents);
      
      return synthesis;
      
    } catch (error) {
      console.error('❌ Orchestration failed:', error);
      await this.cleanupAgents(agents);
      throw error;
    }
  }

  /**
   * Spawn a specialized sub-agent
   */
  async spawnAgent(name, config) {
    const label = `senior-assist-${name}-${Date.now()}`;
    
    const { stdout } = await execPromise(
      `openclaw session spawn --label ${label} --mode run --cleanup delete --model ${config.model || 'sonnet'} --task "${config.task}"`
    );
    
    const sessionKey = stdout.trim();
    
    console.log(`🤖 Spawned ${name} agent: ${sessionKey}`);
    
    return {
      name,
      sessionKey,
      spawnedAt: Date.now()
    };
  }

  /**
   * Get result from sub-agent
   */
  async getAgentResult(sessionKey, timeout = 60000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      try {
        const { stdout } = await execPromise(
          `openclaw sessions history ${sessionKey} --limit 1`
        );
        
        const messages = JSON.parse(stdout);
        if (messages.length > 0 && messages[0].role === 'assistant') {
          return messages[0].content;
        }
      } catch (e) {
        // Agent may not be done yet
      }
      
      // Wait before polling again
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    throw new Error(`Agent ${sessionKey} timed out`);
  }

  /**
   * Synthesize results from multiple agents
   */
  async synthesizeResults(results) {
    // Use a final "synthesizer" agent to combine results
    const synthAgent = await this.spawnAgent('synthesizer', {
      task: `Combine these agent outputs into a coherent recommendation for the senior:\n\n${results.join('\n\n---\n\n')}`,
      model: 'sonnet'
    });
    
    const synthesis = await this.getAgentResult(synthAgent.sessionKey);
    await this.cleanupAgents([synthAgent]);
    
    return synthesis;
  }

  /**
   * Clean up sub-agents
   */
  async cleanupAgents(agents) {
    for (const agent of agents) {
      try {
        await execPromise(`openclaw subagent kill ${agent.sessionKey}`);
        console.log(`🗑️ Cleaned up ${agent.name} agent`);
      } catch (e) {
        // Agent may have already terminated
      }
    }
  }

  /**
   * Parallel research workflow (example of advanced orchestration)
   */
  async researchRestaurants(location, preferences) {
    console.log(`🔍 Researching restaurants in ${location}...`);
    
    // Spawn 3 research agents with different perspectives
    const agents = await Promise.all([
      this.spawnAgent('researcher-quality', {
        task: `Research high-quality restaurants in ${location} matching: ${preferences}. Focus on food quality and reviews.`,
        model: 'sonnet'
      }),
      this.spawnAgent('researcher-value', {
        task: `Research affordable restaurants in ${location} matching: ${preferences}. Focus on value for money.`,
        model: 'sonnet'
      }),
      this.spawnAgent('researcher-speed', {
        task: `Research fast delivery restaurants in ${location} matching: ${preferences}. Focus on delivery time and reliability.`,
        model: 'sonnet'
      })
    ]);
    
    // Get all results in parallel
    const results = await Promise.all(
      agents.map(a => this.getAgentResult(a.sessionKey))
    );
    
    // Synthesize into final recommendation
    const recommendation = await this.synthesizeResults(results);
    
    // Cleanup
    await this.cleanupAgents(agents);
    
    return recommendation;
  }
}

module.exports = new AgentOrchestrator();
