		class StoppableThread extends Thread
		{
			
			private boolean shouldStop = false;
			
			public StoppableThread() { super(); }
			
			public void stopThread() { shouldStop = true; }
			
			public boolean shouldStop() { return shouldStop; }
			
		}